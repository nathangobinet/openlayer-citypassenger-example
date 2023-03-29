import { Feature, Map as OlMap } from "ol";
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM.js';
import { View } from 'ol';
import { Control, defaults as defaultControls } from 'ol/control.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Geometry, LineString, Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import CircleStyle from 'ol/style/Circle';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import MapUtils from "./MapUtils";
import { Extent } from "ol/extent";
import { Checkpoint } from "../../types";
import Text from "ol/style/Text";

interface GroupMapOptions {
  cursorElement: HTMLDivElement,
  mapElement: HTMLDivElement,
  checkpoints: Checkpoint[];
}

class CustomMap {
  map: OlMap;
  private stepLayer: VectorLayer<VectorSource<Geometry>>;
  private lineLayer: VectorLayer<VectorSource<Geometry>>;

  constructor(options: GroupMapOptions) {
    this.stepLayer = this.createStepsLayer(options.checkpoints);
    this.lineLayer = this.createLineLayer(options.checkpoints);
    this.map = this.createMap(options.mapElement, options.cursorElement);
    if (options.checkpoints.length === 0) return;
    const [minBound, maxBound] = this.getBounds(options.checkpoints);
    this.fitExtent([minBound[0], minBound[1], maxBound[0], maxBound[1]])
  }

  private createLineLayer(steps: Checkpoint[]): VectorLayer<VectorSource<Geometry>> {
    return new VectorLayer({
      source: new VectorSource({
        features: [],
      }),
      renderBuffer: 10000,
    });
  }

  private createStepsLayer(steps: Checkpoint[]): VectorLayer<VectorSource<Geometry>> {
    return new VectorLayer({
      source: new VectorSource({
        features: this.getStepsFeatures(steps),
      }),
      renderBuffer: 10000,
    });
  }

  private getStepsFeatures(steps: Checkpoint[]) {
    return steps.map((step, index) => {
      const fea = new Feature(new Point(fromLonLat(step.coordinate)));
      fea.setStyle(this.stepStyle());
      return fea;
    });
  }

  private stepStyle(selected = false, color?: string, order?: number) {
    return new Style({
      image:
        new CircleStyle({
          radius: 15,
          fill: new Fill({ color: selected ? '#78FF86' : '#828282' }),
          stroke: new Stroke({ color: color || '#000000', width: color ? 2 : 1 }),
        }),
      ...(order && {
        text: new Text({
          text: order?.toString(),
          fill: new Fill({ color: 'white' }),
          font: 'bold 20px sans-serif',
        })
      })
    });
  }

  private createMap(target: HTMLDivElement, cusrorTarget: HTMLDivElement): OlMap {
    return new OlMap({
      target,
      controls: defaultControls().extend([
        new Control({ element: cusrorTarget }),
      ]),
      layers: [
        new TileLayer({ source: new OSM() }),
        this.lineLayer,
        this.stepLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }

  private getBounds(steps: Checkpoint[]): Coordinate[] {
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

  public updateCheckpoints(steps: Checkpoint[]) {
    const source = this.stepLayer.getSource();
    if (!source) return;
    source.clear();
    source.addFeatures(this.getStepsFeatures(steps));
  }

  public async changeSelectedCheckpoint(stepIndex: number) {
    if (stepIndex === -1) return;
    const source = this.stepLayer.getSource();
    if (!source) return;
    const features = source.getFeatures();
    const featureToSelect = features[stepIndex];
    featureToSelect.setStyle(this.stepStyle(true));
    const extent = featureToSelect.getGeometry()?.getExtent();
    if (extent) await this.fitExtent(extent);
  }

  public async updateSelectedJourney(steps: Map<number, Checkpoint>, color: string) {
    const checkpointSource = this.stepLayer.getSource();
    if (!checkpointSource) return;
    const checkpointFeatures = checkpointSource.getFeatures();
     Array.from(steps.keys()).forEach((id, order) => {
      checkpointFeatures[Number(id)].setStyle(this.stepStyle(false, color, order + 1));
    });
    const lineSource = this.lineLayer.getSource();
    if (!lineSource) return;
    const checkpoints = Array.from(steps.values());
    for (let i = 0; i < checkpoints.length - 1; i += 1) {
      const start = fromLonLat(checkpoints[i].coordinate);
      const end = fromLonLat(checkpoints[i + 1].coordinate);
      const fea = new Feature(new LineString([start, end]));
      fea.setStyle(new Style({ stroke: new Stroke({ color, width: 2 }) }));
      lineSource.addFeature(fea);
    }
    const [minBound, maxBound] = this.getBounds(checkpoints);
    this.fitExtent([minBound[0], minBound[1], maxBound[0], maxBound[1]]);
  }

  public clearAddtionalStyles() {
    const checkpointSource = this.stepLayer.getSource();
    if (!checkpointSource) return;
    const checkpointFeatures = checkpointSource.getFeatures();
    checkpointFeatures.forEach((fea) => fea.setStyle(this.stepStyle()))
    const lineSource = this.lineLayer.getSource();
    lineSource?.clear();
  }

  public destroy() {
    this.map.dispose();
    this.map.setTarget(undefined);
  }
}

export default CustomMap;
