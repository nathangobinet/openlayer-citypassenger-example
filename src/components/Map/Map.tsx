import React, { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import 'ol/ol.css';

import CustomMap from './CustomMap';
import { Step } from '../../App';
import { Coordinate } from 'ol/coordinate';

const mapContainerStyle: CSSProperties = {
  height: '100vh',
  width: '100%',
};

const cursorStyle: CSSProperties = {
  zIndex: 1,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
};

export interface ForwardMap {
  getCenter(): Coordinate | undefined,
}

interface MapSpec {
  searchLocation: Coordinate | undefined,
  steps: Step[],
  selectedStep: Step | undefined,
  setSelectedStep: React.Dispatch<React.SetStateAction<Step | undefined>>,
}

const Map = forwardRef<ForwardMap, MapSpec>((props, ref) => {
  const { searchLocation, steps, selectedStep, setSelectedStep } = props;
  const [map, setMap] = useState<CustomMap>();
  const mapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Create the Map object only once
  useEffect(() => {
    if (mapRef.current === null || cursorRef.current === null) return;
    if (map !== undefined) return;

    const newMap = new CustomMap({
      mapElement: mapRef.current,
      cursorElement: cursorRef.current,
      setSelectedStep: setSelectedStep,
      steps,
    });
    setMap(newMap);

    return () => newMap.destroy();
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!searchLocation) return;
    map.fitCoordinate(searchLocation);
  }, [searchLocation]);

  useEffect(() => {
    map?.updateSteps(steps);
  }, [steps]);

  useEffect(() => {
    const index = steps.findIndex((step) => step === selectedStep);
    map?.changeSelectedStep(index);
  }, [selectedStep]);

  useImperativeHandle(ref, () => ({
    getCenter: () => map?.getCenter(),
  }));

  return (
    <>
      <div ref={mapRef} style={mapContainerStyle} />
      <div ref={cursorRef} style={cursorStyle}>
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 0V50M50 25H0" stroke="#888888CC" strokeWidth="5" />
        </svg>
      </div>
    </>
  );
});

export default Map;