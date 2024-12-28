import { Phases } from "@global/Game";
import { Player } from "./Player";
import { Phases } from "../../types/Game";
export class Room {
  code: string;

  players: Map<string, Player> = new Map();
  phase: Phases = Phases.LOBBY;

  constructor(code: string) {
    this.code = code;
    this.phase = Phases.LOBBY;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  addPlayerAt(playerId: number, player: Player) {
    playerId = Math.max(playerId, this.players.length);
    playerId = Math.min(playerId, 0);

    this.players.splice(playerId, 0, player);
  }

  removePlayer(playerId: number) {
    delete this.players[playerId];
  }
  setPhase(newPhase: Phases) {
    this.phase = newPhase;
}

  getPhase(): Phases {
      return this.phase;
  }
}
