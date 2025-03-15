import { Phases } from "@global/Game";
import { PhaseHandler } from "./PhasesManager";
import { config } from "@/constants";

export const phaseHandlers: Record<Phases, PhaseHandler> = {
  [Phases.LOBBY]: {
    duration: null,
    onEnter(game) {
      game._players.reset();
    },
    transition(game) {
      const readyPlayersCount = game._players.all.filter((player) => player.isReady).length;
      if (readyPlayersCount >= config.MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START) {
        return Phases.ROLE_ASSIGNMENT;
      }

      return null;
    },
  },
  [Phases.ROLE_ASSIGNMENT]: {
    duration: config.TIMEOUTS_MS[Phases.ROLE_ASSIGNMENT],
    onEnter(game) {
      // Since after shuffling the array the order of players should be random enough
      // the arbitrary indices can be modified to other numbers, but the ranges must be disjoint.
      // const players_shuffled = shuffle(players);
      // const detective = players_shuffled.at(0).id;
      // const bodyguard = players_shuffled.at(1).id;
      // const guaranteed_number_of_mafia = Math.floor(n / config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS);
      // const chance_for_another_mafioso =
      //   (n % config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS) / config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS;
      // const another_mafioso = Math.random() < chance_for_another_mafioso ? 1 : 0;
      // const mafia_range_upper_bound_exclusive = 2 + guaranteed_number_of_mafia + another_mafioso;
      // const mafia: Array<string> = players_shuffled.slice(2, mafia_range_upper_bound_exclusive).map((p: Player) => {
      //   return p.id;
      // });
      // const regular_citizens = players_shuffled.slice(mafia_range_upper_bound_exclusive, n);
      // this.setPlayerRole(detective, Roles.DETECTIVE);
      // this.setPlayerRole(bodyguard, Roles.BODYGUARD);
      // for (const m of mafia) {
      //   this.setPlayerRole(m, Roles.MAFIOSO);
      // }
      // for (const c of regular_citizens) {
      //   this.setPlayerRole(c, Roles.REGULAR_CITIZEN);
      // }
    },
    transition(game, isTimeup) {
      if (isTimeup) return Phases.WELCOME;
      return null;
    },
  },
  [Phases.WELCOME]: {
    duration: config.TIMEOUTS_MS[Phases.WELCOME],
    onEnter(game) {},
    transition(game, isTimeup) {
      if (isTimeup) return Phases.DEBATE;
      return null;
    },
  },
  [Phases.DEBATE]: {
    duration: config.TIMEOUTS_MS[Phases.DEBATE],
    onEnter(game) {},
    transition(game, isTimeup) {
      if (isTimeup) return Phases.VOTING;
      return null;
    },
  },
  [Phases.VOTING]: {
    duration: config.TIMEOUTS_MS[Phases.VOTING],
    onEnter(game) {},
    transition(game, isTimeup) {
      const allVoted = game._players.all.every((player) => player.vote !== null);
      if (isTimeup || allVoted) return Phases.ROLE_REVEAL;
      return null;
    },
  },
  [Phases.ROLE_REVEAL]: {
    duration: config.TIMEOUTS_MS[Phases.ROLE_REVEAL],
    onEnter(game) {
      // TODO:
      // - kill player and reveal the role of the player
      // or
      // - nobody dies
    },
    transition(game, isTimeup) {
      if (isTimeup) {
        // TODO: Check if the game is over (over ? Phases.GAME_END : Phases.NIGHT)

        return Phases.NIGHT;
      }
      return null;
    },
  },
  [Phases.NIGHT]: {
    duration: config.TIMEOUTS_MS[Phases.NIGHT],
    onEnter(game) {},
    transition(game, isTimeup) {
      if (isTimeup) return Phases.BODYGUARD_DEFENSE;
      return null;
    },
  },
  [Phases.BODYGUARD_DEFENSE]: {
    duration: config.TIMEOUTS_MS[Phases.BODYGUARD_DEFENSE],
    onEnter(game) {},
    transition(game, isTimeup) {
      if (isTimeup || game._chosen_by_bodyguard) return Phases.DETECTIVE_CHECK;
      return null;
    },
  },
  [Phases.DETECTIVE_CHECK]: {
    duration: config.TIMEOUTS_MS[Phases.DETECTIVE_CHECK],
    onEnter(game) {},
    transition(game, isTimeup) {
      if (isTimeup || game._chosen_by_detective) return Phases.MAFIA_VOTING;
      return null;
    },
  },
  [Phases.MAFIA_VOTING]: {
    duration: config.TIMEOUTS_MS[Phases.MAFIA_VOTING],
    onEnter(game) {},
    transition(game, isTimeup) {
      const allVoted = game._players.mafia.every((player) => player.vote !== null);
      if (isTimeup || allVoted) return Phases.ROUND_END;
      return null;
    },
  },
  [Phases.ROUND_END]: {
    duration: config.TIMEOUTS_MS[Phases.ROUND_END],
    onEnter(game) {},
    transition(game, isTimeup) {
      if (isTimeup) {
        // TODO: Check if the game is over (over ? Phases.GAME_END : Phases.DEBATE)
        return Phases.DEBATE;
      }
      return null;
    },
  },
  [Phases.GAME_END]: {
    duration: config.TIMEOUTS_MS[Phases.GAME_END],
    onEnter(game) {},
    transition(game, isTimeup) {
      if (isTimeup) return Phases.LOBBY;
      return null;
    },
  },
};

// Fisher-Yates Sorting Algorithm, pseudorandom only
function shuffleFisherYates<T extends any[]>(array: T): T {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
