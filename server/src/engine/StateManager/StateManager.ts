// export class StateManager<State extends Record<string, any>> {
//   private handlers: Partial<{ [key in keyof State]: (value: State[key]) => void }> = {};
//   on<P extends keyof State>(property: P, callback: (value: State[P]) => void) {
//     this.handlers[property] = callback;
//   }
//   emit<P extends keyof State>(property: P, value: State[P]) {
//     const handler = this.handlers[property];
//     if (handler) handler(value);
//   }
// }

import { PlayerModel } from "@global/PlayerModel";
import { Roles } from "@global/Roles";
import { Player } from "../PlayersManager/Player";
import { InternalError } from "../InternalError";
import Game from "../Game";

export class StateManager {
  updateError(game: Game, playerdId: string | null, error: Error) {
    game.onerror(playerdId, error);
  }

  updatePhase(game: Game) {
    game.onphasechange(game._phase.current);
  }

  updateLastKilled(game: Game) {
    game.onkilled(game._lastKilled);
  }

  updatePlayers(game: Game) {
    for (const _player of game._players.all) {
      if (!_player.online) continue;

      let playersState: PlayerModel[];
      switch (_player.role) {
        case null:
        case Roles.REGULAR_CITIZEN:
          playersState = this.getRegularCitizenPlayersState(game, _player);
          break;
        case Roles.MAFIOSO:
          playersState = this.getMafiosoPlayersState(game, _player);
          break;
        case Roles.DETECTIVE:
          playersState = this.getDetectivePlayersState(game, _player);
          break;
        case Roles.BODYGUARD:
          playersState = this.getBodyguardPlayersState(game, _player);
          break;
        default:
          throw new InternalError("unknownRole");
      }
      game.onplayerschange(_player.id, playersState);
    }
  }

  private getRegularCitizenPlayersState(game: Game, player: Player): PlayerModel[] {
    // !!! PLAYERS MUST BE CLONED !!!
    return [...game._players.all].map((p) => {
      const isYou = p.id === player.id;
      const knowsRole = p.revealed;
      return {
        id: p.id,
        name: p.name,
        alive: p.alive,
        online: p.online,
        vote: isYou ? p.vote : null, // Citizens can see their own vote
        role: isYou || knowsRole ? p.role : null, // Citizens can see their own and revealed roles
        guarded: false,
        isReady: p.isReady,
        persona: p.persona,
        seat: p.seat,
      } as PlayerModel;
    });
  }

  private getMafiosoPlayersState(game: Game, player: Player): PlayerModel[] {
    // !!! PLAYERS MUST BE CLONED !!!
    return [...game._players.all].map((p) => {
      const isYou = p.id === player.id;
      const isMafioso = p.role === Roles.MAFIOSO;
      return {
        id: p.id,
        name: p.name,
        alive: p.alive,
        online: p.online,
        vote: isYou || isMafioso ? p.vote : null, // Mafiosos can see other mafiosos' votes
        role: p.role === Roles.MAFIOSO ? Roles.MAFIOSO : Roles.REGULAR_CITIZEN, // Mafiosos can see only if the player is citizen or mafioso
        guarded: false,
        isReady: p.isReady,
        persona: p.persona,
        seat: p.seat,
      } as PlayerModel;
    });
  }

  private getDetectivePlayersState(game: Game, player: Player): PlayerModel[] {
    // !!! PLAYERS MUST BE CLONED !!!
    return [...game._players.all].map((p) => {
      const isYou = p.id === player.id;
      const knowsRole = p.revealed || p.checked;
      return {
        id: p.id,
        name: p.name,
        alive: p.alive,
        online: p.online,
        vote: isYou ? p.vote : null, // Detectives can see their own vote
        role: isYou || knowsRole ? p.role : null, // Detectives can see their own and revealed roles
        guarded: false,
        isReady: p.isReady,
        persona: p.persona,
        seat: p.seat,
      } as PlayerModel;
    });
  }

  private getBodyguardPlayersState(game: Game, player: Player): PlayerModel[] {
    // !!! PLAYERS MUST BE CLONED !!!
    return [...game._players.all].map((p) => {
      const isYou = p.id === player.id;
      const knowsRole = p.revealed;
      return {
        id: p.id,
        name: p.name,
        alive: p.alive,
        online: p.online,
        vote: isYou ? p.vote : null, // Bodyguards can see their own vote
        role: isYou || knowsRole ? p.role : null, // Bodyguards can see their own and revealed roles
        guarded: p.guarded,
        isReady: p.isReady,
        persona: p.persona,
        seat: p.seat,
      } as PlayerModel;
    });
  }
}
