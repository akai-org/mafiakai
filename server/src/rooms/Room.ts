// import { Game } from "@/engine/Game";

export class Room {
  code: string;
  // game: Game = new Game();
  players = new Map<string, string>();

  constructor(code: string) {
    this.code = code;
  }
}
