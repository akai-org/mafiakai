import type { GameModel } from "@global/GameModel";
import { createContext } from "react";
import type useSocket from "./useSocket";

interface GameContext {
  // Recive data from the server
  state: GameModel;
  connection: ReturnType<typeof useSocket>;

  // To game
  actions: {
    setReady: (ready: boolean) => void;
    setSeat: (seatNumber: number) => void;
    setPlayerName: (name: string) => void;
    vote: (targetId: string) => void;
  };
}

export const initialState: GameContext = {
  state: {} as GameModel,
  connection: {} as ReturnType<typeof useSocket>,
  actions: {
    setReady: () => {},
    setSeat: () => {},
    setPlayerName: () => {},
    vote: () => {},
  },
};

export const ApiContext = createContext<GameContext>(initialState);
