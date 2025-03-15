import { Phases } from "./Game";
import { PayloadError } from "./PayloadErrors";
import { PlayerModel } from "./PlayerModel";

export interface GameModel {
  phase: Phases;
  timer: { start_at: number; end_at: number };

  lastRevealed: string | null;
  lastKilled: string | null;

  players: PlayerModel[];
  error: PayloadError | null;
}
