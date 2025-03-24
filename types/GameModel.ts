import { Phases } from "./Phases";
import { PayloadError } from "./PayloadErrors";
import { PlayerModel } from "./PlayerModel";

export interface GameModel {
  phase: Phases;
  timer: { start_at: number; end_at: number };

  lastKilled: string | null; // last killed and revealed player

  players: PlayerModel[];
  error: PayloadError | null;
}
