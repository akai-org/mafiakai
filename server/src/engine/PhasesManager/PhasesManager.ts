import { Phases } from "@global/Phases";
import Game from "../Game";
import { phaseHandlers } from "./handlers";

export type PhaseHandler = {
  duration: number | null; // Duration of the phase in milliseconds or null if no timeout
  onEnter(game: Game): void; // Called when the phase starts
  transition(game: Game, isTimeup: boolean): Phases | null; // Return the next phase or null if the phase should not change
};

export class PhasesManager {
  private _phase: Phases = Phases.LOBBY; // Current phase
  private phaseHandlers: Record<Phases, PhaseHandler> = phaseHandlers;

  // Extra informations
  private _day: number = 0;
  private _night: number = 0;

  constructor() {}

  // Phase management
  get current() {
    return this._phase;
  }

  update(game: Game): void {
    const nextPhase = this.phaseHandlers[this._phase].transition(game, !game._timer.running);

    game._state.updatePhase(game);
    game._state.updatePlayers(game);
    game._state.updateLastKilled(game);
    if (nextPhase === null) return;

    this._phase = nextPhase;
    this.phaseHandlers[nextPhase].onEnter(game);
    game._state.updatePhase(game);
    game._state.updatePlayers(game);
    game._state.updateLastKilled(game);

    const duration = this.phaseHandlers[nextPhase].duration;
    if (duration !== null && duration > 0) game._timer.start(duration, () => this.update(game));
  }
}
