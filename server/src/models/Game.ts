import { Phases } from "@global/Game";
import { PhaseRouter, Player, Room, Timer } from ".";
import { Roles } from "@global/Roles";

export class Game {
  phase = new PhaseRouter(Phases.LOBBY);
  timer = new Timer(0); // 5 seconds
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

  check_game_end(): boolean {
    const mafia_len = this.room.getPlayers().filter((p: Player) => {
      return p.role === Roles.MAFIOSO;
    }).length;
    const non_mafia_len = this.room.getPlayers().filter((p: Player) => {
      return !(p.role === Roles.MAFIOSO);
    }).length;
    return mafia_len >= non_mafia_len || mafia_len == 0;
  }

  bodyguard_appointed(): boolean {
    return this.chosen_by_bodyguard.length > 1 && this.room.hasPlayer(this.chosen_by_bodyguard);
  }

  detective_appointed(): boolean {
    return this.chosen_by_detective.length > 1 && this.room.hasPlayer(this.chosen_by_detective);
  }
}
