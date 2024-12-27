import { Phases } from "@global/Game";
import { Player } from "./Player";

export class Room {
  code: string;
  players: Map<string, Player> = new Map();
  phase: Phases = Phases.LOBBY;

  constructor(code: string) {
    this.code = code;
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }
}
