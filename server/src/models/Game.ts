import { Timer } from "./Timer";
import crypto from "node:crypto";

export class Game {
  timer = new Timer(0); // 5 seconds
  common_vote = new Map<string, number>();
  mafia_vote = new Map<string, number>();
  chosen_by_detective: string = "";
  chosen_by_bodyguard: string = "";

  mafia_room: string = crypto.randomUUID();
  detective_room: string = crypto.randomUUID();
  bodyguard_room: string = crypto.randomUUID();

  private static find_winners(map: Map<string, number>) {
    var max: number = 0;
    var chosen: Array<string> = [];
    for (const p of map) {
      if (p[1] > max) {
        max = p[1];
        chosen = [p[0]];
      } else if (p[1] === max) {
        chosen.push(p[0]);
      }
    }
    return chosen;
  }

  find_mafia_vote_winners() {
    return Game.find_winners(this.mafia_vote);
  }

  find_common_vote_winners() {
    return Game.find_winners(this.common_vote);
  }
}
