import { createContext, useContext, ReactNode } from 'react';
import { useGameState } from './useGameState';

type GameStateContextType = ReturnType<typeof useGameState>;

export const GameStateContext = createContext<GameStateContextType | null>(null);

export function GameStateProvider({
  topicId,
  children,
}: {
  topicId: string;
  children: ReactNode;
}) {
  const gameState = useGameState(topicId);
  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameStateContext(): GameStateContextType {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error('useGameStateContext must be used within GameStateProvider');
  }
  return ctx;
}
