// import { Game } from "@/engine";

import Game from "@/engine/Game";

// import Game from "../engine";

export class Room {
  code: string;
  game: Game = new Game();
  players = new Map<string, string>();

  constructor(code: string) {
    this.code = code;
  }
}
