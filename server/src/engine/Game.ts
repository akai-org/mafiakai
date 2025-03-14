import { Phases } from "@global/Game";
import { PayloadError } from "@global/PayloadErrors";
import { PlayerModel } from "@global/PlayerModel";
import { Roles } from "@global/Roles";
import { InternalError } from "./InternalError";
import { PhasesManager } from "./PhasesManager/PhasesManager";
import { Timer } from "./PhasesManager/Timer";
import { PlayersManager } from "./PlayersManager/PlayersManager";

export class Game {
  timer = new Timer(); // 5 seconds
  players = new PlayersManager();
  phase = new PhasesManager();

  chosen_by_detective: string | null = null;
  chosen_by_bodyguard: string | null = null;

  // #####################################
  // Functions to make actions in the game
  // #####################################

  proccessJoin(playerId: string) {
    // TODO: Reconnection
    if (this.phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");
    if (this.players.get(playerId)) throw new PayloadError("playerAlreadyExists");

    this.players.add(playerId);
  }

  proccessLeave(playerId: string) {
    // TOOD
  }

  proccessReady(playerId: string, ready: boolean) {
    if (this.phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");
    const player = this.players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    // TODO: ??? any other checks ???
    player.isReady = ready;
  }

  proccessVote(playerId: string, target: string) {
    const player = this.players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");
    if (!player.role) throw new InternalError("playerHasNoRole");
    if (!player.alive) throw new PayloadError("playerIsDead");

    const citizenPass = this.phase.current == Phases.VOTING && player.role !== Roles.MAFIOSO;
    const mafiaPass = this.phase.current == Phases.VOTING && player.role === Roles.MAFIOSO;
    if (!(citizenPass || mafiaPass)) throw new PayloadError("youCannotVoteNow");

    const targetPlayer = this.players.get(target);
    if (!targetPlayer) throw new PayloadError("targetNotFound");
    if (!targetPlayer.alive) throw new PayloadError("targetIsDead");

    // TODO: ??? any other checks ???
    player.vote = target;
  }

  // #############################################
  // Function to collect data
  // #############################################

  onPhaseChange: (phase: Phases) => void = () => {};
  onPlayersChange: (playerId: string, playersState: PlayerModel[]) => void = () => {}; // playerId specific data, citizens don't need to know about mafia
  onGameChange: (/*gameState: GameModel*/) => void = () => {};

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
