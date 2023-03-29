import { createContext, useContext, useState } from "react";
import { AppMode } from "../types";

interface AppModeContextSpec {
  appMode: AppMode,
  setAppMode: React.Dispatch<React.SetStateAction<AppMode>>,
}

const AppModeContext = createContext<AppModeContextSpec | undefined>(undefined);

export function ModeContextProvider({ children }: { children: React.ReactNode }) {
  const [appMode, setAppMode] = useState<AppMode>('checkpoint');

  return (
    <AppModeContext.Provider value={{ appMode, setAppMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode(): AppModeContextSpec {
  const context = useContext(AppModeContext);
  if (!context) throw new Error('Use app mode context without provider');
  return context;
}
