import { createContext, useContext, useState } from "react";
import { Checkpoint } from "../types";
import { checkpoints as defaultCheckpoints } from "./data";
import { useMap } from "./MapContext";

interface CheckpointContextSpec {
  selectedCheckpoint: Checkpoint | undefined,
  checkpoints: Checkpoint[],
  setSelectedCheckpoint: React.Dispatch<React.SetStateAction<Checkpoint | undefined>>,
  addCheckpoint: (name: string) => void,
}

const CheckpointContext = createContext<CheckpointContextSpec | undefined>(undefined);

export function CheckpointContextProvider({ children }: { children: React.ReactNode }) {
  const map = useMap();
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(defaultCheckpoints);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint>();

  const addCheckpoint = (name: string) => {
    if (!map) return;
    const coordinate = map.getCenter();
    if (!coordinate) return;
    setCheckpoints([...checkpoints, { name, coordinate, id: checkpoints.length }]);
  };

  const contextValue = { checkpoints, addCheckpoint, selectedCheckpoint, setSelectedCheckpoint };

  return (
    <CheckpointContext.Provider value={contextValue}>
      {children}
    </CheckpointContext.Provider>
  );
}

export function useCheckpoint(): CheckpointContextSpec {
  const context = useContext(CheckpointContext);
  if (!context) throw new Error('Use checkpoint context without provider');
  return context;
}
