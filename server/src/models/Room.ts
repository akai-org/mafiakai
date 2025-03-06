import { Phases } from "@global/Game";
import { Player } from "./Player";
import { Roles } from "@global/Roles";
import { config } from "@/constants";
import { RoomModel } from "@global/RoomModel";

export class Room implements RoomModel {
  code: string;
  players = new Map<string, Player>();
  phase: Phases = Phases.LOBBY;

  constructor(code: string) {
    this.code = code;
  }

  addPlayer(playerId: string) {
    this.players.set(playerId, new Player(playerId));
  }

  disconnectPlayer(playerId: string) {
    if (this.phase === Phases.LOBBY) {
      this.players.delete(playerId);
    } else {
      this.players.get(playerId)!.online = false;
    }
  }

  hasPlayer(playerId: string) {
    return this.players.has(playerId);
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  setPlayerSeat(playerId: string, seat: number) {
    for (const player of this.getPlayers()) {
      if (player.seat && player.seat >= seat) player.seat++;
    }

    this.players.get(playerId)!.seat = seat;
  }

  setPlayerRole(playerId: string, role: Roles) {
    this.players.get(playerId)!.role = role;
  }

  getPlayersBySeat() {
    return this.getPlayers()
      .filter((player) => player.seat)
      .sort((a, b) => a.seat! - b.seat!);
  }

  some_player_is_not_ready(): boolean {
    return Array.from(this.players.values()).some((x: Player) => {
      return !x.isReady || null_or_undefined(x.name) || null_or_undefined(x.seat);
    });
  }

  check_is_room_ready(): boolean {
    return this.players.size >= config.MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START && !this.some_player_is_not_ready();
  }

  establish_roles(): boolean {
    const players = this.getPlayers();
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

    this.setPlayerRole(detective, Roles.DETECTIVE);
    this.setPlayerRole(bodyguard, Roles.BODYGUARD);
    for (const m of mafia) {
      this.setPlayerRole(m, Roles.MAFIOSO);
    }
    for (const c of regular_citizens) {
      this.setPlayerRole(c, Roles.REGULAR_CITIZEN);
    }

    return true;
  }
}

// Fisher-Yates Sorting Algorithm, pseudorandom only
function shuffle(array: any[]): Array<any> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function null_or_undefined(x: any | null | undefined) {
  return x === null || x === undefined;
}
