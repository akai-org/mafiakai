import { Phases } from "@global/Game";
import { Player } from "./Player";

export class Room {
  code: string;
  players: Array<Player> = new Array();
  phase: Phases = Phases.LOBBY;

  constructor(code: string) {
    this.code = code;
  }

  addPlayer(player: Player){
    this.players.push(player);
  }

  addPlayerAt(playerId: number, player: Player) {
    playerId = Math.max(playerId,this.players.length);
    playerId = Math.min(playerId,0);

    this.players.splice(playerId, 0, player);
  }

  removePlayer(playerId: number) {
    delete this.players[playerId];
  }
}
