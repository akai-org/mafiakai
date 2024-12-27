import { Player } from "./Player";
import { Phases } from "../../types/Game";
export class Room {
  code: string;
  players: Map<string, Player> = new Map();
  phase: Phases;
  constructor(code: string) {
    this.code = code;
    this.phase = Phases.LOBBY;
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }
  setPhase(newPhase: Phases) {
    this.phase = newPhase;
}

  getPhase(): Phases {
      return this.phase;
  }
}
