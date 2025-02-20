import { Phases } from "@global/Game";
import { Player } from "./Player";
import { Roles } from "@global/Roles";

export class Room {
  code: string;
  private players = new Map<string, Player>();
  phase: Phases = Phases.LOBBY;

  constructor(code: string) {
    this.code = code;
  }

  addPlayer(playerId: string) {
    this.players.set(playerId, new Player(playerId));
  }

  disconnectPlayer(playerId: string) {
    if (this.phase === Phases.LOBBY) {
      this.players.delete(playerId);
    } else {
      this.players.get(playerId)!.online = false;
    }
  }

  hasPlayer(playerId: string) {
    return this.players.has(playerId);
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  setPlayerSeat(playerId: string, seat: number) {
    for (const player of this.getPlayers()) {
      if (player.seat && player.seat >= seat) player.seat++;
    }

    this.players.get(playerId)!.seat = seat;
  }

  setPlayerRole(playerId: string, role: Roles) {
    this.players.get(playerId)!.role = role;
  }

  getPlayersBySeat() {
    return this.getPlayers()
      .filter((player) => player.seat)
      .sort((a, b) => a.seat! - b.seat!);
  }
}
