import { Feature, Map } from "ol";
import { Step } from "../../App";
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM.js';
import { View } from 'ol';
import { Control, defaults as defaultControls } from 'ol/control.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Geometry, Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import CircleStyle from 'ol/style/Circle';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import MapUtils from "./MapUtils";
import { Extent } from "ol/extent";

interface GroupMapOptions {
  setSelectedStep: React.Dispatch<React.SetStateAction<Step | undefined>>,
  cursorElement: HTMLDivElement,
  mapElement: HTMLDivElement,
  steps: Step[];
}

class CustomMap {
  map: Map;
  resetFunc?: () => void;
  private stepLayer: VectorLayer<VectorSource<Geometry>>;
  private setSelectedStep: React.Dispatch<React.SetStateAction<Step | undefined>>;

  constructor(options: GroupMapOptions) {
    this.setSelectedStep = options.setSelectedStep;
    this.stepLayer = this.createStepsLayer(options.steps);
    this.map = this.createMap(options.mapElement, options.cursorElement);
    if (options.steps.length === 0) return;
    const [minBound, maxBound] = this.getBounds(options.steps);
    this.fitExtent([minBound[0], minBound[1], maxBound[0], maxBound[1]])
  }

  private createStepsLayer(steps: Step[]): VectorLayer<VectorSource<Geometry>> {
    return new VectorLayer({
      source: new VectorSource({
        features: this.getStepsFeatures(steps),
      }),
      renderBuffer: 10000,
    });
  }

  private getStepsFeatures(steps: Step[]) {
    return steps.map((step, index) => {
      const fea = new Feature(new Point(fromLonLat(step.coordinate)));
      fea.setStyle(this.stepStyle());
      return fea;
    });
  }

  private stepStyle(selected = false) {
    return new Style({
      image:
        new CircleStyle({
          radius: 15,
          fill: new Fill({ color: selected ? '#78FF86' : '#828282CC' }),
          stroke: new Stroke({ color: '#000000', width: 1 }),
        })
    });
  }

  private createMap(target: HTMLDivElement, cusrorTarget: HTMLDivElement): Map {
    return new Map({
      target,
      controls: defaultControls().extend([
        new Control({ element: cusrorTarget }),
      ]),
      layers: [
        new TileLayer({ source: new OSM() }),
        this.stepLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }

  private getBounds(steps: Step[]): Coordinate[] {
    const flatDeviceCoordinates = steps.map((step) => fromLonLat(step.coordinate));
    return MapUtils.enlargeBounds(
      MapUtils.getMinBound(flatDeviceCoordinates),
      MapUtils.getMaxBound(flatDeviceCoordinates),
    );
  }

  public getCenter(): Coordinate | undefined {
    const center = this.map.getView().getCenter();
    if (!center) return undefined;
    return toLonLat(center);
  }

  public fitCoordinate(coord: Coordinate) {
    const extent = new Point(fromLonLat(coord)).getExtent();
    this.fitExtent(extent);
  }

  private fitExtent(extent: Extent) {
    return new Promise((resolve) => {
      this.map.getView().fit(extent, {
        duration: 500,
        padding: [100, 100, 100, 100],
        maxZoom: 16,
        callback: resolve
      });
    })
  }

  public updateSteps(steps: Step[]) {
    const source = this.stepLayer.getSource();
    if (!source) return;
    source.clear();
    source.addFeatures(this.getStepsFeatures(steps));
  }

  public async changeSelectedStep(stepIndex: number) {
    this.dontListenForChange();
    const source = this.stepLayer.getSource();
    if (!source) return;
    const features = source.getFeatures();
    // Reset style
    features.forEach((fea) => fea.setStyle(this.stepStyle()))
    if (stepIndex === -1) return;
    const featureToSelect = features[stepIndex];
    featureToSelect.setStyle(this.stepStyle(true));
    const extent = featureToSelect.getGeometry()?.getExtent();
    if (extent) await this.fitExtent(extent);
    // Set select to undefined on new movement
    this.listenForChange();
  }

  private resetSelectedStep() {
    this.setSelectedStep(undefined);
    this.dontListenForChange();
  }

  private listenForChange() {
    this.resetFunc = this.resetSelectedStep.bind(this);
    this.map.getView().addEventListener('change', this.resetFunc)
  }

  private dontListenForChange() {
    if (!this.resetFunc) return;
    this.map.getView().removeEventListener('change', this.resetFunc);
    this.resetFunc = undefined;
  }

  public destroy() {
    this.map.dispose();
    this.map.setTarget(undefined);
  }
}

export default CustomMap;
