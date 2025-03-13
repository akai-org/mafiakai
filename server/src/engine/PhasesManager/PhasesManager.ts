import { Phases } from "@global/Game";
import { Game } from "../Game";
import { phaseHandlers } from "./handlers";

type Flags = "detectiveAppointed" | "bodyguardAppointed";

export type PhaseHandler = { onEnter(game: Game): void; transition(game: Game): Phases | null };

export class PhasesManager {
  private _phase: Phases = Phases.LOBBY; // Current phase
  private _flags: Record<Flags, boolean> = { detectiveAppointed: false, bodyguardAppointed: false }; // Action flags

  private phaseHandlers: Record<Phases, PhaseHandler> = phaseHandlers;

  // Extra informations
  private _day: number = 0;
  private _night: number = 0;

  constructor() {}

  // Flags management
  raiseFlag(flag: Flags) {
    this._flags[flag] = true;
  }

  lowerFlags() {
    for (const flag of Object.keys(this._flags)) this._flags[flag as Flags] = false;
  }

  getFlag(flag: Flags) {
    return this._flags[flag];
  }

  // Phase management
  get current() {
    return this._phase;
  }

  update(game: Game): void {
    const nextPhase = this.phaseHandlers[this._phase].transition(game);

    if (nextPhase) {
      this.phaseHandlers[nextPhase].onEnter(game);
      this._phase = nextPhase;
    }
  }
}
