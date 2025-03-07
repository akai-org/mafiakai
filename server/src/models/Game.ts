import { Roles } from "@global/Roles";
import { Timer } from "./Timer";
import crypto from "node:crypto";

export class Game {
  timer = new Timer(0); // 5 seconds
  common_vote = new Map<string, number>();
  mafia_vote = new Map<string, number>();
  chosen_by_detective: string = "";
  chosen_by_bodyguard: string = "";

  readonly socket_rooms = new Map<Roles, string>([
    [Roles.REGULAR_CITIZEN, crypto.randomUUID()],
    [Roles.MAFIOSO, crypto.randomUUID()],
    [Roles.DETECTIVE, crypto.randomUUID()],
    [Roles.BODYGUARD, crypto.randomUUID()],
  ]);

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
