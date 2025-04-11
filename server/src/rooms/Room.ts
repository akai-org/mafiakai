import Game from "@/engine/Game";
import { MAServer, MASocket } from "@/types";
import { PayloadError } from "@global/PayloadErrors";
import { PlayerModel } from "@global/PlayerModel";

export class Room {
  code: string;
  game: Game = new Game();

  constructor(code: string, socket: MAServer) {
    this.code = code;
    this.bindServerActions(socket);
  }

  private bindServerActions(socket: MAServer) {
    // Broadcast to all players
    this.game.onphasechange = (phase) => {
      socket.to(this.code).emit("newPhase", phase);
    };
    this.game.ontimerchange = (start_at: number, end_at: number) => {
      socket.to(this.code).emit("newTimer", { start_at, end_at });
    };

    this.game.onreveal = (playerId: string | null) => {
      socket.to(this.code).emit("newLastKilled", playerId);
    };

    this.game.onkilled = (playerId: string | null) => {
      socket.to(this.code).emit("newLastKilled", playerId);
    };

    // Broadcast to specific player (or not)
    this.game.onplayerschange = (playerId: string, playersState: PlayerModel[]) => {
      socket.to(playerId).emit("newPlayers", playersState);
    };
    this.game.onerror = (playerId: string | null, error: PayloadError) => {
      socket.to(playerId === null ? this.code : playerId).emit("newError", error);
    };
  }
}
