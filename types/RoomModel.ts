import { Phases } from "@global/Game";
import { PlayerModel } from "./PlayerModel";

export interface RoomModel {
  code: string;
  players: Map<string, PlayerModel>;
  phase: Phases;
}