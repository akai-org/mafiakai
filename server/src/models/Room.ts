import { Phases } from "@global/Game";
import { Player } from "../engine/PlayersManager/Player";
import { Roles } from "@global/Roles";
import { config } from "@/constants";
import { RoomModel } from "@global/RoomModel";
import { Game } from "../engine/Game";
import { Timer } from "../engine/PhasesManager/Timer";
import { socketsServer } from "@/routes";

export class Room implements RoomModel {
  code: string;
  players = new Map<string, Player>();
  phase: Phases = Phases.LOBBY;
  // game: Game = new Game();

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

  check_game_end(): Roles.MAFIOSO | Roles.REGULAR_CITIZEN | null {
    const mafia_len = this.getPlayers().filter((p: Player) => {
      return p.role === Roles.MAFIOSO;
    }).length;
    const non_mafia_len = this.getPlayers().filter((p: Player) => {
      return !(p.role === Roles.MAFIOSO);
    }).length;

    if (mafia_len >= non_mafia_len) return Roles.MAFIOSO;
    else if (mafia_len == 0) return Roles.REGULAR_CITIZEN;
    else return null;
  }

  bodyguard_appointed(): boolean {
    return this.game.chosen_by_bodyguard.length > 1 && this.hasPlayer(this.game.chosen_by_bodyguard);
  }

  detective_appointed(): boolean {
    return this.game.chosen_by_detective.length > 1 && this.hasPlayer(this.game.chosen_by_detective);
  }

  /**
   * Change current phase to @param phase. Broadcast this change to all players in in @param room using @param socket.
   *
   * @param phase - phase to change to
   * @returns
   */
  change_to(phase: Phases) {
    this.game.timer.clear();
    if (this.phase != phase) {
      this.phase = phase;
      socketsServer.to(this.code).emit("phase_updated", phase);
    }
  }

  /**
   * Set timer and broadcast `phase_after_timeout` as planned after `timeout_ms`.
   * Additionally run `run_before_switch` before changing phases.
   *
   * @param phase_after_timeout phase to broadcast as planned
   * @param timeout_ms timeout in milliseconds
   * @param run_before_switch any code to run before switching to this phase
   */
  setup_phase_timeout(phase_after_timeout: Phases, timeout_ms: number, run_before_switch?: () => void) {
    if (run_before_switch) run_before_switch();
    socketsServer.to(this.code).emit("planned_phase_change", phase_after_timeout, Date.now() + timeout_ms);
    this.game.timer = new Timer(timeout_ms);
    this.game.timer.start(() => this.update());
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
          this.change_to(Phases.ROLE_ASSIGNMENT);
          this.setup_phase_timeout(Phases.WELCOME, config.TIMEOUTS_MS.get(Phases.ROLE_ASSIGNMENT)!);
        }
      case Phases.ROLE_ASSIGNMENT:
        const some_player_has_no_role = this.getPlayers().some((player: Player) => {
          null_or_undefined(player.role) && player.online;
        });
        if (some_player_has_no_role) {
          this.establish_roles();
          for (const player of this.getPlayers()) {
            // Create socket.io channels for each specific role in the game room and assign players to these channels
            socketsServer
              .in(player.id)
              .fetchSockets()
              .then((matching_sockets) => {
                const player_socket = matching_sockets.at(0)!;
                player_socket.join(this.game.socket_rooms.get(player.role!)!);
              })
              .catch((error) => {
                console.log(error);
              });
          }
          for (const role in Roles) {
            const role1: Roles = role as Roles;
            socketsServer.in(this.game.socket_rooms.get(role1)!).emit("set_player_role", role1);
          }
        }
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.WELCOME);
          this.setup_phase_timeout(Phases.DEBATE, config.TIMEOUTS_MS.get(Phases.WELCOME)!);
        }
      case Phases.WELCOME:
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.DEBATE);
          this.setup_phase_timeout(Phases.VOTING, config.TIMEOUTS_MS.get(Phases.DEBATE)!);
        }
      case Phases.DEBATE:
        if (this.check_is_room_ready() || !this.game.timer.isRunning) {
          this.change_to(Phases.VOTING);
          this.setup_phase_timeout(Phases.ROLE_REVEAL, config.TIMEOUTS_MS.get(Phases.VOTING)!, () => {
            socketsServer.to(this.code).emit("send_voting_result", false, null);
          });
        }
      case Phases.VOTING:
        if (!this.game.timer.isRunning || sum(this.game.common_vote) === this.getPlayers().length) {
          const winners = this.game.find_common_vote_winners();
          this.game.reset_votings();
          if (winners.length == 1) {
            this.change_to(Phases.ROLE_REVEAL);
            socketsServer.to(this.code).emit("send_voting_result", true, this.getPlayer(winners.at(0)!)!);
            this.setup_phase_timeout(Phases.NIGHT, config.TIMEOUTS_MS.get(Phases.ROLE_REVEAL)!);
          } else {
            // RESTART VOTING
            this.change_to(Phases.VOTING);
            this.setup_phase_timeout(Phases.ROLE_REVEAL, config.TIMEOUTS_MS.get(Phases.VOTING)!, () => {
              socketsServer.to(this.code).emit("send_voting_result", false, null);
            });
          }
        }
      case Phases.ROLE_REVEAL:
        if (!this.game.timer.isRunning) {
          const game_status = this.check_game_end();
          if (game_status !== null) {
            this.change_to(Phases.GAME_END);
            // send winner (MAFIA or CITIZENS)
            socketsServer.to(this.code).emit("end_game", game_status);
          } else {
            this.change_to(Phases.NIGHT);
            this.setup_phase_timeout(Phases.BODYGUARD_DEFENSE, config.TIMEOUTS_MS.get(Phases.NIGHT)!);
          }
        }
      case Phases.NIGHT:
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.BODYGUARD_DEFENSE);
          this.setup_phase_timeout(Phases.DETECTIVE_CHECK, config.TIMEOUTS_MS.get(Phases.BODYGUARD_DEFENSE)!);
        }
      case Phases.BODYGUARD_DEFENSE:
        if (this.bodyguard_appointed() || !this.game.timer.isRunning) {
          this.change_to(Phases.DETECTIVE_CHECK);
          this.setup_phase_timeout(Phases.MAFIA_VOTING, config.TIMEOUTS_MS.get(Phases.DETECTIVE_CHECK)!, () => {
            socketsServer.to(this.game.socket_rooms.get(Roles.DETECTIVE)!).emit("send_detective_check", null);
          });
        }
      case Phases.DETECTIVE_CHECK:
        if (this.detective_appointed() || !this.game.timer.isRunning) {
          socketsServer
            .to(this.game.socket_rooms.get(Roles.DETECTIVE)!)
            .emit("send_detective_check", this.getPlayer(this.game.chosen_by_detective) ?? null);
          this.change_to(Phases.MAFIA_VOTING);
          this.setup_phase_timeout(Phases.ROUND_END, config.TIMEOUTS_MS.get(Phases.MAFIA_VOTING)!);
        }
      case Phases.MAFIA_VOTING:
        const num_mafia = this.getPlayers().filter((p: Player) => {
          return p.role === Roles.MAFIOSO && p.online;
        }).length;
        if (sum(this.game.mafia_vote) === num_mafia || !this.game.timer.isRunning) {
          const winners = this.game.find_mafia_vote_winners();
          const saved = this.game.chosen_by_bodyguard;
          this.game.reset_votings();
          if (winners.length == 1) {
            this.change_to(Phases.ROUND_END);
            if (winners.at(0) === saved) {
              const saved_player = this.getPlayer(saved);
              if (saved_player) {
                socketsServer.to(this.code).emit("night_summary", null, { ...saved_player, role: null });
              } else {
                socketsServer.to(this.code).emit("night_summary", null, null);
              }
            } else {
              socketsServer.to(this.code).emit("night_summary", this.getPlayer(winners.at(0) ?? "") ?? null, null);
            }
            this.setup_phase_timeout(Phases.DEBATE, config.TIMEOUTS_MS.get(Phases.ROUND_END)!);
          } else {
            // RESTART MAFIA_VOTING
            this.change_to(Phases.MAFIA_VOTING);
            this.setup_phase_timeout(Phases.ROUND_END, config.TIMEOUTS_MS.get(Phases.MAFIA_VOTING)!);
          }
        }
      case Phases.ROUND_END:
        if (!this.game.timer.isRunning) {
          const game_status = this.check_game_end();
          if (game_status !== null) {
            this.change_to(Phases.GAME_END);
            socketsServer.to(this.code).emit("end_game", game_status);
          } else {
            this.change_to(Phases.DEBATE);
            this.setup_phase_timeout(Phases.VOTING, config.TIMEOUTS_MS.get(Phases.DEBATE)!);
          }
        }
      case Phases.GAME_END:
        if (!this.game.timer.isRunning) {
          this.change_to(Phases.LOBBY);
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
