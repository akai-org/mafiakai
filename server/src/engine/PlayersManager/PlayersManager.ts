import { config } from "@/constants";
import { Roles } from "@global/Roles";
import { InternalError } from "../InternalError";
import { Player } from "./Player";

export class PlayersManager {
  private players = new Map<string, Player>();

  constructor() {}

  // Player management

  add(playerId: string): Player {
    const player = new Player(playerId);
    this.players.set(playerId, player);
    return player;
  }

  remove(playerId: string) {
    this.players.delete(playerId);
  }

  has(playerId: string) {
    return this.players.has(playerId);
  }

  get(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  get all() {
    return Array.from(this.players.values());
  }

  get citizens() {
    return this.all.filter(({ role }) => role && role != Roles.MAFIOSO);
  }

  get mafia() {
    return this.all.filter((player) => player.role === Roles.MAFIOSO);
  }

  reset() {
    /* TODO */
  }

  // Seat management
  seatAt(playerId: string, seat: number){
    const player = this.players.get(playerId)
    if (player === undefined) return false;

    const seated = this.all.filter((a)=>!(a.seat === null))
    let i = Math.max(Math.min(seat,seated.length),0);
    for (let j of seated){
      if (j.seat! >= i){
        j.seat!++;
      }
    }
    player.seat = i;
    return true;
  }

  // Role management

  establish_roles(): boolean {
    const players = this.all;
    const n = players.length;
    if (n < config.MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START) {
      return false;
    }

    // Since after shuffling the array the order of players should be random enough
    // the arbitrary indices can be modified to other numbers, but the ranges must be disjoint.
    const players_shuffled = shuffle(players);
    const detective = players_shuffled.at(0).id;
    const bodyguard = players_shuffled.at(1).id;

    const guaranteed_number_of_mafia = Math.floor(n / config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS);
    const chance_for_another_mafioso =
      (n % config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS) / config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS;
    const another_mafioso = Math.random() < chance_for_another_mafioso ? 1 : 0;
    const mafia_range_upper_bound_exclusive = 2 + guaranteed_number_of_mafia + another_mafioso;
    const mafia: Array<string> = players_shuffled.slice(2, mafia_range_upper_bound_exclusive).map((p: Player) => {
      return p.id;
    });

    const regular_citizens = players_shuffled.slice(mafia_range_upper_bound_exclusive, n);

    const playerDetective = this.get(detective);
    if (!playerDetective) throw new InternalError("playerNotFound");
    playerDetective.role = Roles.DETECTIVE;

    const playerBodyguard = this.get(bodyguard);
    if (!playerBodyguard) throw new InternalError("playerNotFound");
    playerBodyguard.role = Roles.BODYGUARD;

    for (const m of mafia) {
      const player = this.get(m);
      if (!player) throw new InternalError("playerNotFound");
      player.role = Roles.MAFIOSO;
    }

    for (const c of regular_citizens) {
      const player = this.get(c.id);
      if (!player) throw new InternalError("playerNotFound");
      player.role = Roles.REGULAR_CITIZEN;
    }

    return true;
  }
}

// Fisher-Yates shuffle algorithm, pseudorandom only
function shuffle(array: any[]): Array<any> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
