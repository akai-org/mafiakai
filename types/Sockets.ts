import type { Phases } from "./Game";

export interface Server2ClientEvents {
  rooms_data: (rooms: Array<String>) => void;
  conn_info_data: (data: ConnectionInfoData) => void;
  phase_updated: (phase: Phases) => void;
}

export type ConnectionInfoData = { playerId: string };
export type ResponseHandler = (message: string) => void;

export interface Client2ServerEvents {
  setPosition: (position: number, callback: ResponseHandler) => void;
  vote: (data: string) => void;
  send_player_name: (playerName: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  playerId: string;
  roomCode: string;
}
