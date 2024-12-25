import { Player } from "./Player";

export class Room {
  code: string;
  players: Map<string, Player> = new Map();

  constructor(code: string) {
    this.code = code;
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }
  setPhase(newPhase: string) {
    this.phase = newPhase;
}

  getPhase(): string {
      return this.phase;
  }
}
