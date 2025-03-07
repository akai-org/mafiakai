import { Phases } from "@global/Game";
import { Game, Player, Timer } from ".";
import { Roles } from "@global/Roles";
import { MASocket } from "@/types";
import { config } from "@/constants";

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

// if (check_is_room_ready(room)) {
//   const one_second = 1_000;
//   socket.to(room.code).emit("planned_phase_change", Phases.ROLE_ASSIGNMENT, Date.now() + one_second);
//   setTimeout(() => {
//     room.phase = Phases.ROLE_ASSIGNMENT;
//     socket.to(room.code).emit("phase_updated", room.phase);
//     if (!establish_roles(room)) {
//       console.log("Inconsistent limits for the minimum number of players");
//       return;
//     }
//     for (const p of room.getPlayers()) {
//       // TODO: Generate rooms for each [(specific role) intersection (game room)]
//       // TODO: Add players to these rooms
//       socket.to(p.id).emit("set_player_role", p.role!);
//     }
//     room.phase = Phases.WELCOME;
//     socket.to(room.code).emit("phase_updated", room.phase);
//     socket.to(room.code).emit("planned_phase_change", Phases.DAY, Date.now() + 5 * one_second);
//     setTimeout(() => {
//       room.phase = Phases.DAY;
//       socket.to(room.code).emit("phase_updated", room.phase);
//     }, 5 * one_second);
//   }, one_second);
// }

export class PhaseRouter {
  constructor(public current: Phases) {}

  /**
   * Change current phase to @param phase. Broadcast this change to all players in in @param game using @param socket.
   * Additionally if @param phase_after_timeout then set `phase` timer and broadcast `phase_after_timeout` as planned
   * using default values from configuration
   *
   * @param phase - phase to change to
   * @param game - current game instance
   * @param socket - socket.io server socket
   * @param phase_after_timeout - optional, if set then `phase` timer is set and `phase_after_timeout` is broadcasted as planned
   * @returns
   */
  change_to(phase: Phases, game: Game, socket: MASocket, phase_after_timeout?: Phases | null) {
    if (this.current != phase) {
      this.current = phase;
      socket.to(game.room.code).emit("phase_updated", phase);
    }
    if (phase_after_timeout != null) {
      const timeout_ms = config.TIMEOUTS_MS.get(phase);
      if (timeout_ms === undefined) return;
      socket.to(game.room.code).emit("planned_phase_change", phase_after_timeout, Date.now() + timeout_ms);
      game.timer = new Timer(timeout_ms);
      game.timer.start(() => this.update(game, socket));
    }
  }

  /**
   * Update current phase as specified by the flowchart
   * https://discord.com/channels/768494845634412624/1315074188519804928/1345725803278897214
   * Meant to be run on almost all incoming server socket events.
   *
   * @param game - current game instance
   * @param socket - socket.io server socket
   * @returns
   */
  update(game: Game, socket: MASocket) {
    switch (this.current) {
      case Phases.LOBBY:
        if (game.room.check_is_room_ready()) {
          this.change_to(Phases.ROLE_ASSIGNMENT, game, socket, Phases.WELCOME);
        }
      case Phases.ROLE_ASSIGNMENT:
        const some_player_has_no_role = game.room.getPlayers().some((player: Player) => {
          null_or_undefined(player.role) && player.online;
        });
        if (!some_player_has_no_role && !game.timer.isRunning) {
          this.change_to(Phases.WELCOME, game, socket, Phases.DEBATE);
        }
      case Phases.WELCOME:
        if (!game.timer.isRunning) {
          this.change_to(Phases.DEBATE, game, socket, Phases.VOTING);
        }
      case Phases.DEBATE:
        if (game.room.check_is_room_ready() || !game.timer.isRunning) {
          this.change_to(Phases.VOTING, game, socket, Phases.ROLE_REVEAL);
        }
      case Phases.VOTING:
        if (!game.timer.isRunning || sum(game.common_vote) === game.room.getPlayers().length) {
          const winners = Game.find_winners(game.common_vote);
          if (winners.length == 1) {
            this.change_to(Phases.ROLE_REVEAL, game, socket, Phases.NIGHT);
          } else {
            // TODO: RESTART VOTING
            // socket something
            this.change_to(Phases.VOTING, game, socket, Phases.ROLE_REVEAL);
          }
        }
      case Phases.ROLE_REVEAL:
        if (!game.timer.isRunning) {
          // TODO: send revealed role
          if (game.check_game_end()) {
            this.change_to(Phases.GAME_END, game, socket, null);
            // TODO: send winner (MAFIA or CITIZENS)
          } else {
            this.change_to(Phases.NIGHT, game, socket, Phases.BODYGUARD_DEFENSE);
          }
        }
      case Phases.NIGHT:
        if (!game.timer.isRunning) {
          this.change_to(Phases.BODYGUARD_DEFENSE, game, socket, Phases.DETECTIVE_CHECK);
        }
      case Phases.BODYGUARD_DEFENSE:
        if (game.bodyguard_appointed() || !game.timer.isRunning) {
          this.change_to(Phases.DETECTIVE_CHECK, game, socket, Phases.MAFIA_VOTING);
        }
      case Phases.DETECTIVE_CHECK:
        if (game.detective_appointed() || !game.timer.isRunning) {
          this.change_to(Phases.MAFIA_VOTING, game, socket, Phases.ROUND_END);
        }
      case Phases.MAFIA_VOTING:
        const num_mafia = game.room.getPlayers().filter((p: Player) => {
          return p.role === Roles.MAFIOSO && p.online;
        }).length;
        if (sum(game.mafia_vote) === num_mafia || !game.timer.isRunning) {
          const winners = Game.find_winners(game.mafia_vote);
          if (winners.length == 1) {
            this.change_to(Phases.ROUND_END, game, socket, Phases.DEBATE);
          } else {
            // TODO: RESTART MAFIA_VOTING
            // socket something
            this.change_to(Phases.MAFIA_VOTING, game, socket, Phases.ROUND_END);
          }
        }
      case Phases.ROUND_END:
        if (!game.timer.isRunning) {
          if (game.check_game_end()) {
            this.change_to(Phases.GAME_END, game, socket, null);
          } else {
            this.change_to(Phases.DEBATE, game, socket, Phases.VOTING);
          }
        }
      case Phases.GAME_END:
        if (!game.timer.isRunning) {
          this.change_to(Phases.LOBBY, game, socket, null);
        }
    }
  }
}
