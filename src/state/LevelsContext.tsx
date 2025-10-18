import React, { createContext, useContext, useMemo, useState } from 'react';
import { LEVELS, LevelConfig } from '../logic/levels';

type LevelsContextType = {
  currentLevelIndex: number;
  level: LevelConfig;
  nextLevel: () => void;
  resetLevels: () => void;
};

const LevelsContext = createContext<LevelsContextType | undefined>(undefined);

export const LevelsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const value = useMemo<LevelsContextType>(
    () => ({
      currentLevelIndex,
      level: LEVELS[currentLevelIndex],
      nextLevel: () => setCurrentLevelIndex((i) => (i + 1) % LEVELS.length),
      resetLevels: () => setCurrentLevelIndex(0),
    }),
    [currentLevelIndex]
  );

  return <LevelsContext.Provider value={value}>{children}</LevelsContext.Provider>;
};

export function useLevels() {
  const ctx = useContext(LevelsContext);
  if (!ctx) throw new Error('useLevels must be used within LevelsProvider');
  return ctx;
}


