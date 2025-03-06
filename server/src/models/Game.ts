import { Phases } from "@global/Game";
import { PhaseRouter, Room, Timer } from ".";

export class Game {
    phase = new PhaseRouter(Phases.LOBBY);
    timer = new Timer(5000); // 5 seconds
    common_vote = new Map<string, number>();
    mafia_vote = new Map<string, number>();
    chosen_by_detective: string = "";
    chosen_by_bodyguard: string = "";
    constructor(public room: Room) {}
  
    static find_winners(map: Map<string, number>) {
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
  }