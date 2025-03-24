import { createContext } from "react";
import type { GameModel } from "@global/GameModel";
import type { Persona } from "@global/Persona";

export interface GameContextType {
  isConnected: boolean;
  connectionError: Error | null;

  gameState: GameModel | null;

  setReady: (ready: boolean) => void;
  vote: (targetId: string) => void;
  upgradePersona: (persona: Persona) => void;
  setSeat: (seatNumber: number) => void;
  setPlayerName: (name: string) => void;

  connect: (roomCode: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const GameContext = createContext<GameContextType>({
  isConnected: false,
  connectionError: null,
  gameState: null,

  setReady: () => {},
  vote: () => {},
  upgradePersona: () => {},
  setSeat: () => {},
  setPlayerName: () => {},

  connect: () => {},
  disconnect: () => {},
  reconnect: () => {},
});
