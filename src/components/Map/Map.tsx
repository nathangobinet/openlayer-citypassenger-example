import { CSSProperties, useEffect, useRef } from 'react';
import CustomMap from './CustomMap';
import { Coordinate } from 'ol/coordinate';
import { useCheckpoint } from '../../context/CheckpointContext';
import { useMap, useRegisterMap } from '../../context/MapContext';
import { useAppMode } from '../../context/ModeContext';
import { useJourney } from '../../context/JourneyContext';

import 'ol/ol.css';

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

interface MapSpec {
  searchLocation: Coordinate | undefined,
}

function Map({ searchLocation }: MapSpec) {
  const map = useMap();
  const registerMap = useRegisterMap();
  const { appMode } = useAppMode();
  const { checkpoints, selectedCheckpoint } = useCheckpoint();
  const { selectedJourney, selectedJourneyCheckpoints } = useJourney();
  const mapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Create the Map object only once
  useEffect(() => {
    if (mapRef.current === null || cursorRef.current === null) return;
    if (map !== undefined) return;

    const newMap = new CustomMap({
      mapElement: mapRef.current,
      cursorElement: cursorRef.current,
      checkpoints,
    });
    registerMap(newMap);

    return () => newMap.destroy();
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!searchLocation) return;
    map.fitCoordinate(searchLocation);
  }, [searchLocation]);

  useEffect(() => {
    map?.updateCheckpoints(checkpoints);
  }, [checkpoints]);

  const handleJourney = () => {
    map?.updateSelectedJourney(selectedJourneyCheckpoints, selectedJourney.color);
  }

  const handleCheckpoints = () => {
    const index = checkpoints.findIndex((checkpoint) => checkpoint === selectedCheckpoint);
    map?.changeSelectedCheckpoint(index);
  }

  useEffect(() => {
    map?.clearAddtionalStyles();
    if (appMode === 'checkpoint') handleCheckpoints();
    if (appMode === 'journey') handleJourney();
  }, [selectedCheckpoint, selectedJourney, appMode]);

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
};

export default Map;