import { Phases } from "@global/Game";
import { Player, Room } from "./";
import { Roles } from "@global/Roles";

function sum(map: Map<any, number>): number {
  var res = 0;
  for (const val of map.values()) {
    res += val;
  }
  return res;
}

function null_or_undefined(x: any | null | undefined) {
  return x === null || x === undefined;
}

export class Timer {
  public isRunning = false;
  private timeout_id: NodeJS.Timeout | null = null;
  private callback: (() => void) | null = null;
  private until: number | null = null;
  constructor(private time: number) {}

  getUntil() {
    return this.until;
  }

  extend(milliseconds: number) {
    if (this.isRunning === false || null_or_undefined(this.timeout_id) || null_or_undefined(this.callback)) {
      throw new Error("Nothing is scheduled.");
    }
    clearTimeout(this.timeout_id!);
    this.isRunning = true;
    this.until = Date.now() + milliseconds;
    setTimeout(() => {
      this.isRunning = false;
      this.callback!();
    }, milliseconds);
  }

  start(callback: () => void) {
    this.isRunning = true;
    this.until = Date.now() + this.time;
    this.callback = callback;
    this.timeout_id = setTimeout(() => {
      this.isRunning = false;
      callback();
    }, this.time);
  }
}

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

export type TransitionCondition = (game: Game) => Phases | null;
export type PhasesTransitionsConditions = Record<Phases, TransitionCondition>;

export class PhaseRouter {
  constructor(public current: Phases) {}

  private phases: PhasesTransitionsConditions = {
    [Phases.LOBBY]: (game) => {
      if (game.room.check_is_room_ready()) return Phases.ROLE_ASSIGNMENT;
      //   if (!game.timer.isRunning) return Phases.ROLE_ASSIGNMENT;
      return null;
    },
    [Phases.ROLE_ASSIGNMENT]: function (game: Game): Phases | null {
      if (
        !game.room.getPlayers().some((player: Player) => {
          null_or_undefined(player.role);
        }) &&
        !game.timer.isRunning
      ) {
        return Phases.WELCOME;
      }
      return null;
    },
    [Phases.WELCOME]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.DAY;
      return null;
    },
    [Phases.DAY]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.DEBATE;
      return null;
    },
    [Phases.DEBATE]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.VOTING;
      return null;
    },
    [Phases.VOTING]: function (game: Game): Phases | null {
      if (sum(game.common_vote) === game.room.getPlayers().length) {
        const winners = Game.find_winners(game.common_vote);
        if (winners.length == 1) {
          return Phases.NIGHT;
        }
      }
      return null;
    },
    [Phases.NIGHT]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.BODYGUARD_DEFENSE;
      return null;
    },
    [Phases.BODYGUARD_DEFENSE]: function (game: Game): Phases | null {
      if (!null_or_undefined(game.chosen_by_bodyguard)) {
        return Phases.DETECTIVE_CHECK;
      }
      if (!game.timer.isRunning) return Phases.DETECTIVE_CHECK;
      return null;
    },
    [Phases.DETECTIVE_CHECK]: function (game: Game): Phases | null {
      if (!null_or_undefined(game.chosen_by_detective)) {
        return Phases.MAFIA_VOTING;
      }
      if (!game.timer.isRunning) return Phases.MAFIA_VOTING;
      return null;
    },
    [Phases.MAFIA_VOTING]: function (game: Game): Phases | null {
      if (
        sum(game.mafia_vote) ===
        game.room.getPlayers().filter((p: Player) => {
          return p.role === Roles.MAFIOSO;
        }).length
      ) {
        const winners = Game.find_winners(game.mafia_vote);
        if (winners.length == 1) {
          return Phases.ROUND_END;
        }
      }
      if (!game.timer.isRunning) return Phases.ROUND_END;
      return null;
    },
    [Phases.ROUND_END]: function (game: Game): Phases | null {
      const mafia_len = game.room.getPlayers().filter((p: Player) => {
        return p.role === Roles.MAFIOSO;
      }).length;
      const non_mafia_len = game.room.getPlayers().filter((p: Player) => {
        return !(p.role === Roles.MAFIOSO);
      }).length;
      if (mafia_len >= non_mafia_len || mafia_len == 0) {
        return Phases.GAME_END;
      }
      return null;
    },
    [Phases.GAME_END]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.LOBBY;
      return null;
    },
  };

  update(game: Game) {
    const transition = this.phases[this.current](game);
    if (transition) this.current = transition;
  }
}
