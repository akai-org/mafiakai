import type { GameModel } from "@global/GameModel";
import { createContext } from "react";
import type useSocket from "./useSocket";
import { Phases } from "@global/Phases";

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
  state: {
    players: [],
    yourId: "",
    phase: Phases.LOBBY,
    error: null,
    lastKilled: null,
    timer: { start_at: 0, end_at: 0 },
  },
  connection: {} as ReturnType<typeof useSocket>,
  actions: {
    setReady: () => {},
    setSeat: () => {},
    setPlayerName: () => {},
    vote: () => {},
  },
};

export const ApiContext = createContext<GameContext>(initialState);
