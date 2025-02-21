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
      if (game.room.getPlayers().every((player) => player.isReady)) return Phases.WELCOME;
      if (!game.timer.isRunning) return Phases.WELCOME;
      return null;
    },
    [Phases.ROLE_ASSIGNMENT]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.WELCOME]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.DAY]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.DEBATE]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.VOTING]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.VOTING_OVERTIME]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.NIGHT]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.BODYGUARD_DEFENSE]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.DETECTIVE_CHECK]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.MAFIA_VOTING]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.ROUND_END]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
    [Phases.GAME_END]: function (game: Game): Phases | null {
      throw new Error("Function not implemented.");
    },
  };

  update(game: Game) {
    const transition = this.phases[this.current](game);
    if (transition) this.current = transition;
  }
}
