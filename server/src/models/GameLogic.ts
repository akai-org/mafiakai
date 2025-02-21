import { Phases } from "@global/Game";
import { Room } from "./Room";

export class Timer {
  public isRunning = false;
  constructor(private time: number) {}

  start(callback: () => void) {
    if (this.isRunning) console.info("Timer is already running");
    this.isRunning = true;
    setTimeout(() => {
      this.isRunning = false;
      callback();
    }, this.time);
  }
}

export class Game {
  phase = new PhaseRouter(Phases.LOBBY);
  timer = new Timer(5000); // 5 seconds
  constructor(public room: Room) {}
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
