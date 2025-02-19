import type { Phases } from "./Game";

type timestamp = number;

export interface Server2ClientEvents {
  rooms_data: (rooms: Array<String>) => void;
  conn_info_data: (data: ConnectionInfoData) => void;
  phase_updated: (phase: Phases) => void;
  planned_phase_change: (phase: Phases, when: timestamp) => void; // Notifies about upcoming changes to phases with a numeric unix timestamp in milliseconds (Date.now())
}

export type ConnectionInfoData = { playerId: string };
export type ResponseHandler = (message: string) => void;

export interface Client2ServerEvents {
  set_position: (position: number, callback: ResponseHandler) => void;
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
