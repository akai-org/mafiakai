import { Roles } from "@global/Roles";
import { Timer } from "../models/Timer";
import crypto from "node:crypto";
import { PlayersManager } from "./PlayersManager/PlayersManager";
import { PhasesManager } from "./PhasesManager/PhasesManager";

export class Game {
  timer = new Timer(0); // 5 seconds
  players = new PlayersManager();
  phase = new PhasesManager();

  chosen_by_detective: string | null = null;
  chosen_by_bodyguard: string | null = null;

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

  reset_votings() {
    this.common_vote = new Map<string, number>();
    this.mafia_vote = new Map<string, number>();
    this.chosen_by_detective = "";
    this.chosen_by_bodyguard = "";
  }
}
