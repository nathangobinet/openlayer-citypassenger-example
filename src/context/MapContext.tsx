/* eslint-disable max-len */
import { Dispatch, createContext, useContext, useState, SetStateAction } from 'react';
import CustomMap from '../components/Map/CustomMap';

interface MapContextSpec {
  setMap: Dispatch<SetStateAction<CustomMap | undefined>>,
  map: CustomMap | undefined,
}

const MapContext = createContext<MapContextSpec | undefined>(undefined);

export function MapContextProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<CustomMap>();

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}

export function useRegisterMap() {
  const context = useContext(MapContext);
  if (context === undefined) throw new Error('Accessing checkpoint without context');
  return context.setMap;
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) throw new Error('Accessing checkpoint without context');
  return context.map;
}
