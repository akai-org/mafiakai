import { Roles } from "@global/Roles";
import { PlayerModel } from "@global/PlayerModel";
import { PayloadError } from "@global/PayloadErrors";
import { Phases } from "@global/Phases";
import { InternalError } from "./InternalError";
import { PlayersManager } from "./PlayersManager/PlayersManager";
import { PhasesManager } from "./PhasesManager/PhasesManager";
import { Timer } from "./PhasesManager/Timer";

export default class Game {
  // "Private"
  _timer = new Timer(); // 5 seconds
  _players = new PlayersManager();
  _phase = new PhasesManager();
  // _state = new StateManager<GameModel>();

  _chosen_by_detective: string | null = null;
  _chosen_by_bodyguard: string | null = null;
  _lastKilled: string | null = null; // Last player killed by citizens or mafia vote
  _winner: "citizens" | "mafia" | null = null;

  // #####################################
  // Functions to make actions in the game
  // #####################################

  update() {
    this._phase.update(this);
  }

  join(playerId: string) {
    let player = this._players.get(playerId);

    if (!player) {
      // Player is not in the game, check if can join
      if (this._phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");
      player = this._players.add(playerId);
    } else {
      // Player is already in the game, check if can reconnect
      if (player.online) throw new PayloadError("playerIsAlreadyConnected");
      player.online = true;
    }

    this._players.add(playerId);
  }

  leave(playerId: string) {
    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    player.online = false;
    if (this._phase.current === Phases.LOBBY) this._players.remove(playerId);
  }

  ready(playerId: string, value: boolean) {
    if (this._phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");
    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    if (player.persona === null || player.seat === null)
      throw new PayloadError("playerCannotBeReady")
    player.isReady = value;
  }

  vote(playerId: string, target: string) {
    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");
    if (!player.alive) throw new PayloadError("playerIsDead");

    const citizenPass = this._phase.current === Phases.VOTING;
    const mafiaPass = this._phase.current === Phases.MAFIA_VOTING && player.role === Roles.MAFIOSO;
    if (!(citizenPass || mafiaPass)) throw new PayloadError("youCannotVoteNow");

    const targetPlayer = this._players.get(target);
    if (!targetPlayer) throw new PayloadError("targetNotFound");
    if (!targetPlayer.alive) throw new PayloadError("targetIsDead");

    player.vote = target;
  }

  // ########################### //
  // Function to collect data    //
  // ########################### //

  onphasechange: (phase: Phases) => void = () => {};
  ontimerchange: (start_at: number, end_at: number) => void = () => {};

  onreveal: (playerId: string | null) => void = () => {};
  onkilled: (playerId: string | null) => void = () => {};

  onplayerschange: (playerId: string, playersState: PlayerModel[]) => void = () => {};
  onerror: (error: PayloadError) => void = () => {};

  // readonly socket_rooms = new Map<Roles, string>([
  //   [Roles.REGULAR_CITIZEN, crypto.randomUUID()],
  //   [Roles.MAFIOSO, crypto.randomUUID()],
  //   [Roles.DETECTIVE, crypto.randomUUID()],
  //   [Roles.BODYGUARD, crypto.randomUUID()],
  // ]);

  // private static find_winners(map: Map<string, number>) {
  //   var max: number = 0;
  //   var chosen: Array<string> = [];
  //   for (const p of map) {
  //     if (p[1] > max) {
  //       max = p[1];
  //       chosen = [p[0]];
  //     } else if (p[1] === max) {
  //       chosen.push(p[0]);
  //     }
  //   }
  //   return chosen;
  // }

  // find_mafia_vote_winners() {
  //   return Game.find_winners(this.mafia_vote);
  // }

  // find_common_vote_winners() {
  //   return Game.find_winners(this.common_vote);
  // }

  // reset_votings() {
  //   this.common_vote = new Map<string, number>();
  //   this.mafia_vote = new Map<string, number>();
  //   this.chosen_by_detective = "";
  //   this.chosen_by_bodyguard = "";
  // }
}
