import type { Phases } from "./Game";
import { PlayerModel } from "./PlayerModel";
import { Roles } from "./Roles";

type timestamp = number;

export interface Server2ClientEvents {
  rooms_data: (rooms: Array<String>) => void;
  conn_info_data: (data: ConnectionInfoData) => void;
  phase_updated: (phase: Phases) => void;
  planned_phase_change: (phase: Phases, when: timestamp) => void; // Notifies about upcoming changes to phases with a numeric unix timestamp in milliseconds (Date.now())
  set_player_role: (role: Roles) => void;
  send_detective_check: (player: PlayerModel | null) => void;
  send_voting_result: (is_decisive: boolean, player: PlayerModel | null) => void;
  end_game: (winner: Roles.MAFIOSO | Roles.REGULAR_CITIZEN) => void;
  night_summary: (died: PlayerModel | null, saved: PlayerModel | null) => void;
}

export type ConnectionInfoData = { playerId: string };

export interface Client2ServerEvents {
  set_position: (position: number) => void;
  send_player_name: (playerName: string) => void;
  set_ready: () => void;
  vote: (player_id: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  playerId: string;
  roomCode: string;
}
