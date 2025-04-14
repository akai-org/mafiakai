import type { GameModel } from "./GameModel";
import type { Persona } from "./Persona";

export interface Server2ClientEvents {
  // Connection
  sendPlayerId: (playerId: string) => void;

  // GameModel
  newPhase: (phase: GameModel["phase"]) => void;
  newTimer: (timer: GameModel["timer"]) => void;
  newLastKilled: (playerId: GameModel["lastKilled"]) => void;
  newPlayers: (players: GameModel["players"]) => void;
  newError: (error: GameModel["error"]) => void;
}

export type ConnectionInfoData = { [PLAYER_ID_KEY_NAME]: string };

export interface Client2ServerEvents {
  // Lobby management
  setPlayerName(playerName: string): void;
  setSeat(seatNumber: number | null): void;
  updatePersona(persona: Partial<Persona>): void;

  // Game management
  setReady(readiness: boolean): void;
  vote(playerName: string): void;

  check(playerName: string): void; // Detective check
  protect(playerName: string): void; // Bodyguard protect
}

export interface InterServerEvents {
  ping: () => void;
}

export const PLAYER_ID_KEY_NAME = "playerId";
export const ROOM_CODE_KEY_NAME = "roomCode";

export interface SocketData {
  [PLAYER_ID_KEY_NAME]: string;
  [ROOM_CODE_KEY_NAME]: string;
}
