import { Phases } from "@global/Game";
import { Game, Player } from ".";
import { Roles } from "@global/Roles";
import { MASocket } from "@/types";

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

export type TransitionCondition = (game: Game) => Phases | null;
export type PhasesTransitionsConditions = Record<Phases, TransitionCondition>;

export class PhaseRouter {
  constructor(public current: Phases) {}

  private phases: PhasesTransitionsConditions = {
    [Phases.LOBBY]: (game: Game) => {
      if (game.room.check_is_room_ready()) return Phases.ROLE_ASSIGNMENT;
      return null;
    },
    [Phases.ROLE_ASSIGNMENT]: function (game: Game): Phases | null {
      if (
        !game.room.getPlayers().some((player: Player) => {
          null_or_undefined(player.role);
        }) &&
        !game.timer.isRunning
      ) {
        return Phases.WELCOME;
      }
      return null;
    },
    [Phases.WELCOME]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.DAY;
      return null;
    },
    [Phases.DAY]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.DEBATE;
      return null;
    },
    [Phases.DEBATE]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.VOTING;
      return null;
    },
    [Phases.VOTING]: function (game: Game): Phases | null {
      if (sum(game.common_vote) === game.room.getPlayers().length) {
        const winners = Game.find_winners(game.common_vote);
        if (winners.length == 1) {
          return Phases.NIGHT;
        }
      }
      return null;
    },
    [Phases.NIGHT]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.BODYGUARD_DEFENSE;
      return null;
    },
    [Phases.BODYGUARD_DEFENSE]: function (game: Game): Phases | null {
      if (!null_or_undefined(game.chosen_by_bodyguard)) {
        return Phases.DETECTIVE_CHECK;
      }
      if (!game.timer.isRunning) return Phases.DETECTIVE_CHECK;
      return null;
    },
    [Phases.DETECTIVE_CHECK]: function (game: Game): Phases | null {
      if (!null_or_undefined(game.chosen_by_detective)) {
        return Phases.MAFIA_VOTING;
      }
      if (!game.timer.isRunning) return Phases.MAFIA_VOTING;
      return null;
    },
    [Phases.MAFIA_VOTING]: function (game: Game): Phases | null {
      if (
        sum(game.mafia_vote) ===
        game.room.getPlayers().filter((p: Player) => {
          return p.role === Roles.MAFIOSO;
        }).length
      ) {
        const winners = Game.find_winners(game.mafia_vote);
        if (winners.length == 1) {
          return Phases.ROUND_END;
        }
      }
      if (!game.timer.isRunning) return Phases.ROUND_END;
      return null;
    },
    [Phases.ROUND_END]: function (game: Game): Phases | null {
      const mafia_len = game.room.getPlayers().filter((p: Player) => {
        return p.role === Roles.MAFIOSO;
      }).length;
      const non_mafia_len = game.room.getPlayers().filter((p: Player) => {
        return !(p.role === Roles.MAFIOSO);
      }).length;
      if (mafia_len >= non_mafia_len || mafia_len == 0) {
        return Phases.GAME_END;
      }
      return null;
    },
    [Phases.GAME_END]: function (game: Game): Phases | null {
      if (!game.timer.isRunning) return Phases.LOBBY;
      return null;
    },
  };

  update(game: Game) {
    const transition = this.phases[this.current](game);
    if (transition) this.current = transition;
  }
}
