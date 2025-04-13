import { PayloadError } from "@global/PayloadErrors";
import { Phases } from "@global/Phases";
import { PlayerModel } from "@global/PlayerModel";
import { InputManager } from "./InputManager/InputManager";
import { OutputManager } from "./OutputManager/OutputManager";
import { PhasesManager } from "./PhasesManager/PhasesManager";
import { Timer } from "./PhasesManager/Timer";
import { PlayersManager } from "./PlayersManager/PlayersManager";
import { InternalError } from "./InternalError";

export default class Game {
  // "Private"
  _timer = new Timer(); // 5 seconds
  _players = new PlayersManager();
  _phase = new PhasesManager();

  _output = new OutputManager();
  _input = new InputManager();

  _chosen_by_detective: string | null = null;
  _chosen_by_bodyguard: string | null = null;
  _lastKilled: string | null = null;
  _winner: "citizens" | "mafia" | null = null;

  // #####################################
  // Functions to make actions in the game
  // #####################################

  update() {
    this._phase.update(this);
  }

  execute<A extends keyof InputManager>(action: A, ...args: Parameters<InputManager[A]>) {
    const fn = this._input[action] as (...args: any[]) => void;
    if (fn === undefined) throw new PayloadError("undefinedCall");

    try {
      const player = this._players.get(args[0]);
      if (player) console.log(`player ${player.name} > calls "${action}"`);

      // BE CAREFUL: this is a hack to make the function work with the correct context
      (fn as (...args: any[]) => void).call(this, ...args);
    } catch (error) {
      if (error instanceof PayloadError) return this._output.updateError(this, args[0], error);

      if (error instanceof InternalError) console.error(error.name);
    } finally {
      this.update();
    }
  }

  // ########################### //
  // Function to collect data    //
  // ########################### //

  // Broadcast to all players
  onphasechange: (phase: Phases) => void = () => {};
  ontimerchange: (start_at: number, end_at: number) => void = () => {};

  onreveal: (playerId: string | null) => void = () => {};
  onkilled: (playerId: string | null) => void = () => {};

  // Broadcast to specific player
  onplayerschange: (playerId: string, playersState: PlayerModel[]) => void = () => {};
  onerror: (playerId: string | null, error: PayloadError) => void = () => {};
}
