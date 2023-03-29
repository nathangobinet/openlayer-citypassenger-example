import { createContext, useContext, useMemo, useState } from "react";
import { Checkpoint, Journey } from "../types";
import { useCheckpoint } from "./CheckpointContext";
import { journeys } from "./data";

interface JourneyContextSpec {
  selectedJourneyCheckpoints: Map<number, Checkpoint>,
  selectedJourney: Journey,
  setSelectedJourney: React.Dispatch<React.SetStateAction<Journey>>,
  journeys: Journey[],
}

const JourneyCheckpoint = createContext<JourneyContextSpec | undefined>(undefined);

export function JourneyContextProvider({ children }: { children: React.ReactNode }) {
  const { checkpoints } = useCheckpoint();
  const [selectedJourney, setSelectedJourney] = useState<Journey>(journeys[0]);

  const selectedJourneyCheckpoints = useMemo(() => (
    selectedJourney.checkpointIdList.reduce((acc, id) => {
      const index = checkpoints.findIndex((check) => check.id === id);
      if (index !== -1) acc.set(index, checkpoints[index]);
      return acc;
    }, new Map<number, Checkpoint>())
  ), [selectedJourney]);

  const contextValue = { selectedJourneyCheckpoints, selectedJourney, setSelectedJourney, journeys };

  return (
    <JourneyCheckpoint.Provider value={contextValue}>
      {children}
    </JourneyCheckpoint.Provider>
  );
}

export function useJourney(): JourneyContextSpec {
  const context = useContext(JourneyCheckpoint);
  if (!context) throw new Error('Use journey context without provider');
  return context;
}
