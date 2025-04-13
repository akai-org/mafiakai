import { PayloadError } from "@global/PayloadErrors";
import { Persona } from "@global/Persona";
import { Phases } from "@global/Phases";
import { Roles } from "@global/Roles";
import Game from "../Game";

export class InputManager {
  join(this: Game, playerId: string) {
    let player = this._players.get(playerId);

    if (!player) {
      if (this._phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");
      player = this._players.add(playerId);
    } else {
      if (player.online) throw new PayloadError("playerIsAlreadyConnected");
      player.online = true;
    }

    this._players.add(playerId);
  }

  leave(this: Game, playerId: string) {
    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    player.online = false;
    if (this._phase.current === Phases.LOBBY) this._players.remove(playerId);
  }

  ready(this: Game, playerId: string, value: boolean) {
    if (this._phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");
    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    if (player.persona === null || player.seat === null) throw new PayloadError("playerCannotBeReady");
    player.isReady = value;
  }

  vote(this: Game, playerId: string, target: string) {
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

  name(this: Game, playerId: string, name: string) {
    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    if (!(this._phase.current === Phases.LOBBY)) {
      throw new PayloadError("gameAlreadyStarted");
    }

    player.name = name;
  }

  seatAt(this: Game, playerId: string, seat: number | null) {
    if (this._phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");

    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    if (seat === null) return this._players.dropSeat(playerId);
    if (seat < this._players.all.length) return this._players.setSeat(playerId, seat);

    throw new PayloadError("seatNotFound");
  }

  describePlayer(this: Game, playerId: string, persona: Persona) {
    if (this._phase.current !== Phases.LOBBY) throw new PayloadError("gameAlreadyStarted");
    const player = this._players.get(playerId);
    if (!player) throw new PayloadError("playerNotFound");

    player.persona = { ...persona };
  }
}
// export type InputManager = typeof InputManager;
