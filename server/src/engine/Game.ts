import { Timer } from "./PhasesManager/Timer";
import { Roles } from "@global/Roles";
import crypto from "node:crypto";
import { PlayersManager } from "./PlayersManager/PlayersManager";
import { PhasesManager } from "./PhasesManager/PhasesManager";
import { Phases } from "@global/Game";

export class Game {
  timer = new Timer(); // 5 seconds
  players = new PlayersManager();
  phase = new PhasesManager();

  chosen_by_detective: string | null = null;
  chosen_by_bodyguard: string | null = null;

  // Functions to make actions in the game
  proccessReady(playerId: string, ready: boolean) {
    if (this.phase.current !== Phases.LOBBY) return; // TODO: throw new ClientError("gameAlreadyStarted");
    const player = this.players.get(playerId);
    if (!player) return; // TODO: throw new ClientError("playerNotFound");

    // TODO: ??? any other checks ???
    player.isReady = ready;
  }

  proccessVote(playerId: string, target: string) {
    const player = this.players.get(playerId);
    if (!player) return; // TODO throw new ClientError("playerNotFound");
    if (!player.role) return; // TODO throw new InternalError("playerHasNoRole");
    if (!player.alive) return; // TODO throw new ClientError("playerIsDead");

    const citizenPass = this.phase.current == Phases.VOTING && player.role !== Roles.MAFIOSO;
    const mafiaPass = this.phase.current == Phases.VOTING && player.role === Roles.MAFIOSO;
    if (!(citizenPass || mafiaPass)) return; // TODO throw new ClientError("youCannotVoteNow");

    const targetPlayer = this.players.get(target);
    if (!targetPlayer) return; // TODO throw new ClientError("targetNotFound");
    if (!targetPlayer.alive) return; // TODO throw new ClientError("targetIsDead");

    // TODO: ??? any other checks ???
    player.vote = target;
  }

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
