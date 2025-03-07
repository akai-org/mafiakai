import { Phases } from "@global/Game";
import { Player } from "./Player";
import { Roles } from "@global/Roles";
import { config } from "@/constants";
import { RoomModel } from "@global/RoomModel";
import { Game } from "./Game";
import { Timer } from "./Timer";
import { socketsServer } from "@/routes";

export class Room implements RoomModel {
  code: string;
  players = new Map<string, Player>();
  phase: Phases = Phases.LOBBY;
  game: Game = new Game();

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

  check_game_end(): boolean {
    const mafia_len = this.getPlayers().filter((p: Player) => {
      return p.role === Roles.MAFIOSO;
    }).length;
    const non_mafia_len = this.getPlayers().filter((p: Player) => {
      return !(p.role === Roles.MAFIOSO);
    }).length;
    return mafia_len >= non_mafia_len || mafia_len == 0;
  }

  bodyguard_appointed(): boolean {
    return this.game.chosen_by_bodyguard.length > 1 && this.hasPlayer(this.game.chosen_by_bodyguard);
  }

  detective_appointed(): boolean {
    return this.game.chosen_by_detective.length > 1 && this.hasPlayer(this.game.chosen_by_detective);
  }

  /**
   * Change current phase to @param phase. Broadcast this change to all players in in @param room using @param socket.
   * Additionally if @param phase_after_timeout then set `phase` timer and broadcast `phase_after_timeout` as planned
   * using default values from configuration
   *
   * @param phase - phase to change to
   * @param phase_after_timeout - optional, if set then `phase` timer is set and `phase_after_timeout` is broadcasted as planned
   * @returns
   */
  change_to(phase: Phases, phase_after_timeout?: Phases | null) {
    if (this.phase != phase) {
      this.phase = phase;
      socketsServer.to(this.code).emit("phase_updated", phase);
    }
    if (phase_after_timeout != null) {
      const timeout_ms = config.TIMEOUTS_MS.get(phase);
      if (timeout_ms === undefined) return;
      socketsServer.to(this.code).emit("planned_phase_change", phase_after_timeout, Date.now() + timeout_ms);
      this.game.timer = new Timer(timeout_ms);
      this.game.timer.start(() => this.update());
    }
  }

  /**
   * Update current phase as specified by the flowchart
   * https://discord.com/channels/768494845634412624/1315074188519804928/1345725803278897214
   * Meant to be run on almost all incoming server socket events.
   */
  update() {
    switch (this.phase) {
      case Phases.LOBBY:
        if (this.check_is_room_ready()) {
          this.change_to(Phases.ROLE_ASSIGNMENT, Phases.WELCOME);
        }
      case Phases.ROLE_ASSIGNMENT:
        const some_player_has_no_role = this.getPlayers().some((player: Player) => {
          null_or_undefined(player.role) && player.online;
        });
        if (some_player_has_no_role) {
          this.establish_roles();
          for (const player of this.getPlayers()) {
            // socketServer: MAServer is required here
          }
          // TODO: Generate rooms for each [(specific role) intersection (game room)]
          // TODO: Add players to these rooms
          // socket.to(p.id).emit("set_player_role", p.role!);
        }
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.WELCOME, Phases.DEBATE);
        }
      case Phases.WELCOME:
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.DEBATE, Phases.VOTING);
        }
      case Phases.DEBATE:
        if (this.check_is_room_ready() || !this.game.timer.isRunning) {
          this.change_to(Phases.VOTING, Phases.ROLE_REVEAL);
        }
      case Phases.VOTING:
        if (!this.game.timer.isRunning || sum(this.game.common_vote) === this.getPlayers().length) {
          const winners = this.game.find_common_vote_winners();
          if (winners.length == 1) {
            this.change_to(Phases.ROLE_REVEAL, Phases.NIGHT);
          } else {
            // TODO: RESTART VOTING
            // socket something
            this.change_to(Phases.VOTING, Phases.ROLE_REVEAL);
          }
        }
      case Phases.ROLE_REVEAL:
        if (!this.game.timer.isRunning) {
          // TODO: send revealed role
          if (this.check_game_end()) {
            this.change_to(Phases.GAME_END, null);
            // TODO: send winner (MAFIA or CITIZENS)
          } else {
            this.change_to(Phases.NIGHT, Phases.BODYGUARD_DEFENSE);
          }
        }
      case Phases.NIGHT:
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.BODYGUARD_DEFENSE, Phases.DETECTIVE_CHECK);
        }
      case Phases.BODYGUARD_DEFENSE:
        if (this.bodyguard_appointed() || !this.game.timer.isRunning) {
          this.change_to(Phases.DETECTIVE_CHECK, Phases.MAFIA_VOTING);
        }
      case Phases.DETECTIVE_CHECK:
        if (this.detective_appointed() || !this.game.timer.isRunning) {
          this.change_to(Phases.MAFIA_VOTING, Phases.ROUND_END);
        }
      case Phases.MAFIA_VOTING:
        const num_mafia = this.getPlayers().filter((p: Player) => {
          return p.role === Roles.MAFIOSO && p.online;
        }).length;
        if (sum(this.game.mafia_vote) === num_mafia || !this.game.timer.isRunning) {
          const winners = this.game.find_mafia_vote_winners();
          if (winners.length == 1) {
            this.change_to(Phases.ROUND_END, Phases.DEBATE);
          } else {
            // TODO: RESTART MAFIA_VOTING
            // socket something
            this.change_to(Phases.MAFIA_VOTING, Phases.ROUND_END);
          }
        }
      case Phases.ROUND_END:
        if (!this.game.timer.isRunning) {
          if (this.check_game_end()) {
            this.change_to(Phases.GAME_END, null);
          } else {
            this.change_to(Phases.DEBATE, Phases.VOTING);
          }
        }
      case Phases.GAME_END:
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.LOBBY, null);
        }
    }
  }
}

function sum(map: Map<any, number>): number {
  var res = 0;
  for (const val of map.values()) {
    res += val;
  }
  return res;
}

function null_or_undefined(x: any | null | undefined) {
  return x === null || x === undefined;
}

// Fisher-Yates Sorting Algorithm, pseudorandom only
function shuffle(array: any[]): Array<any> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
