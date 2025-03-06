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

export type TransitionCondition = (game: Game, socket: MASocket) => Phases | null;
export type PhasesTransitionsConditions = Record<Phases, TransitionCondition>;

export class PhaseRouter {
  constructor(public current: Phases) {}

  private phases: PhasesTransitionsConditions = {
    [Phases.LOBBY]: function (game: Game, socket: MASocket): Phases | null {
      if (game.room.check_is_room_ready()) {
        socket.to(game.room.code).emit("phase_updated", Phases.ROLE_ASSIGNMENT);
        socket
          .to(game.room.code)
          .emit("planned_phase_change", Phases.WELCOME, Date.now() + config.ROLE_ASSIGNMENT_TIMEOUT_MS);
        game.timer = new Timer(config.ROLE_ASSIGNMENT_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.ROLE_ASSIGNMENT;
      }
      return null;
    },
    [Phases.ROLE_ASSIGNMENT]: function (game: Game, socket: MASocket): Phases | null {
      if (
        !game.room.getPlayers().some((player: Player) => {
          null_or_undefined(player.role);
        }) &&
        !game.timer.isRunning
      ) {
        socket.to(game.room.code).emit("phase_updated", Phases.WELCOME);
        socket.to(game.room.code).emit("planned_phase_change", Phases.DEBATE, Date.now() + config.WELCOME_TIMEOUT_MS);
        game.timer = new Timer(config.WELCOME_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.WELCOME;
      }
      return null;
    },
    [Phases.WELCOME]: function (game: Game, socket: MASocket): Phases | null {
      if (!game.timer.isRunning) {
        socket.to(game.room.code).emit("phase_updated", Phases.DEBATE);
        socket.to(game.room.code).emit("planned_phase_change", Phases.VOTING, Date.now() + config.DEBATE_TIMEOUT_MS);
        game.timer = new Timer(config.DEBATE_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.DEBATE;
      }
      return null;
    },
    [Phases.DEBATE]: function (game: Game, socket: MASocket): Phases | null {
      if (game.room.check_is_room_ready() || !game.timer.isRunning) {
        socket.to(game.room.code).emit("phase_updated", Phases.VOTING);
        socket
          .to(game.room.code)
          .emit("planned_phase_change", Phases.ROLE_REVEAL, Date.now() + config.VOTING_TIMEOUT_MS);
        game.timer = new Timer(config.VOTING_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.VOTING;
      }
      return null;
    },
    [Phases.VOTING]: function (game: Game, socket: MASocket): Phases | null {
      if (!game.timer.isRunning || sum(game.common_vote) === game.room.getPlayers().length) {
        const winners = Game.find_winners(game.common_vote);
        if (winners.length == 1) {
          socket.to(game.room.code).emit("phase_updated", Phases.ROLE_REVEAL);
          socket
            .to(game.room.code)
            .emit("planned_phase_change", Phases.NIGHT, Date.now() + config.ROLE_REVEAL_TIMEOUT_MS);
          game.timer = new Timer(config.ROLE_REVEAL_TIMEOUT_MS);
          // game.timer.start(this.update(game));
          return Phases.ROLE_REVEAL;
        } else {
          // TODO: RESTART VOTING
          // socket something
          socket
            .to(game.room.code)
            .emit("planned_phase_change", Phases.ROLE_REVEAL, Date.now() + config.VOTING_TIMEOUT_MS);
          game.timer = new Timer(config.VOTING_TIMEOUT_MS);
          // game.timer.start(this.update(game));
          return null;
        }
      }
      return null;
    },
    [Phases.ROLE_REVEAL]: function (game: Game, socket: MASocket): Phases | null {
      if (game.timer.isRunning) {
        return null;
      }

      // TODO: send revealed role
      if (game.check_game_end()) {
        socket.to(game.room.code).emit("phase_updated", Phases.GAME_END);
        // TODO: send winner (MAFIA or CITIZENS)
        return Phases.GAME_END;
      } else {
        socket.to(game.room.code).emit("phase_updated", Phases.NIGHT);
        socket
          .to(game.room.code)
          .emit("planned_phase_change", Phases.BODYGUARD_DEFENSE, Date.now() + config.NIGHT_TIMEOUT_MS);
        game.timer = new Timer(config.NIGHT_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.NIGHT;
      }
    },
    [Phases.NIGHT]: function (game: Game, socket: MASocket): Phases | null {
      if (!game.timer.isRunning) {
        socket.to(game.room.code).emit("phase_updated", Phases.BODYGUARD_DEFENSE);
        socket
          .to(game.room.code)
          .emit("planned_phase_change", Phases.DETECTIVE_CHECK, Date.now() + config.BODYGUARD_DEFENSE_TIMEOUT_MS);
        game.timer = new Timer(config.BODYGUARD_DEFENSE_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.BODYGUARD_DEFENSE;
      }
      return null;
    },
    [Phases.BODYGUARD_DEFENSE]: function (game: Game, socket: MASocket): Phases | null {
      if (game.bodyguard_appointed() || !game.timer.isRunning) {
        socket.to(game.room.code).emit("phase_updated", Phases.DETECTIVE_CHECK);
        socket
          .to(game.room.code)
          .emit("planned_phase_change", Phases.MAFIA_VOTING, Date.now() + config.DETECTIVE_CHECK_TIMEOUT_MS);
        game.timer = new Timer(config.DETECTIVE_CHECK_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.DETECTIVE_CHECK;
      }
      return null;
    },
    [Phases.DETECTIVE_CHECK]: function (game: Game, socket: MASocket): Phases | null {
      if (game.detective_appointed() || !game.timer.isRunning) {
        socket.to(game.room.code).emit("phase_updated", Phases.MAFIA_VOTING);
        socket
          .to(game.room.code)
          .emit("planned_phase_change", Phases.ROUND_END, Date.now() + config.MAFIA_VOTE_TIMEOUT_MS);
        game.timer = new Timer(config.MAFIA_VOTE_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.MAFIA_VOTING;
      }
      return null;
    },
    [Phases.MAFIA_VOTING]: function (game: Game, socket: MASocket): Phases | null {
      const num_mafia = game.room.getPlayers().filter((p: Player) => {
        return p.role === Roles.MAFIOSO;
      }).length;
      if (sum(game.mafia_vote) === num_mafia || !game.timer.isRunning) {
        const winners = Game.find_winners(game.mafia_vote);
        if (winners.length == 1) {
          socket.to(game.room.code).emit("phase_updated", Phases.ROUND_END);
          socket
            .to(game.room.code)
            .emit("planned_phase_change", Phases.DEBATE, Date.now() + config.ROUND_END_TIMEMOUT_MS);
          game.timer = new Timer(config.ROUND_END_TIMEMOUT_MS);
          // game.timer.start(this.update(game));
          return Phases.ROUND_END;
        } else {
          // TODO: RESTART MAFIA_VOTING
          // socket something
          socket
            .to(game.room.code)
            .emit("planned_phase_change", Phases.ROUND_END, Date.now() + config.MAFIA_VOTE_TIMEOUT_MS);
          game.timer = new Timer(config.MAFIA_VOTE_TIMEOUT_MS);
          // game.timer.start(this.update(game));
          return null;
        }
      }
      return null;
    },
    [Phases.ROUND_END]: function (game: Game, socket: MASocket): Phases | null {
      if (game.timer.isRunning) {
        return null;
      }

      if (game.check_game_end()) {
        socket.to(game.room.code).emit("phase_updated", Phases.GAME_END);
        socket
          .to(game.room.code)
          .emit("planned_phase_change", Phases.GAME_END, Date.now() + config.GAME_END_TIMEOUT_MS);
        game.timer = new Timer(config.GAME_END_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.GAME_END;
      } else {
        socket.to(game.room.code).emit("phase_updated", Phases.DEBATE);
        socket.to(game.room.code).emit("planned_phase_change", Phases.VOTING, Date.now() + config.DEBATE_TIMEOUT_MS);
        game.timer = new Timer(config.DEBATE_TIMEOUT_MS);
        // game.timer.start(this.update(game));
        return Phases.DEBATE;
      }
    },
    [Phases.GAME_END]: function (game: Game, socket: MASocket): Phases | null {
      if (!game.timer.isRunning) {
        socket.to(game.room.code).emit("phase_updated", Phases.LOBBY);
        return Phases.LOBBY;
      }
      return null;
    },
  };

  update(game: Game, socket: MASocket) {
    const transition = this.phases[this.current](game, socket);
    if (transition) this.current = transition;
  }
}
