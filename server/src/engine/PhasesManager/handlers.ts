import { Phases } from "@global/Phases";
import { PhaseHandler } from "./PhasesManager";
import { config } from "@/constants";
import { InternalError } from "../InternalError";
import { Roles } from "@global/Roles";
import Game from "../Game";

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
      const n = game._players.all.length;
      const players_shuffled = shuffleFisherYates([...game._players.all]);

      const detective = players_shuffled.at(0);
      if (!detective) throw new InternalError("tooFewPlayers");
      const bodyguard = players_shuffled.at(1);
      if (!bodyguard) throw new InternalError("tooFewPlayers");

      const guaranteed_number_of_mafia = Math.floor(n / config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS);
      const chance_for_another_mafioso =
        (n % config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS) / config.GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS;

      const another_mafioso = Math.random() < chance_for_another_mafioso ? 1 : 0;
      const mafia_range_upper_bound_exclusive = 2 + guaranteed_number_of_mafia + another_mafioso;
      const mafia = players_shuffled.slice(2, mafia_range_upper_bound_exclusive);
      const regular_citizens = players_shuffled.slice(mafia_range_upper_bound_exclusive, n);

      detective.role = Roles.DETECTIVE;
      bodyguard.role = Roles.BODYGUARD;
      for (const mafioso of mafia) mafioso.role = Roles.MAFIOSO;
      for (const citizen of regular_citizens) citizen.role = Roles.REGULAR_CITIZEN;
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
      const votes = game._players.all.map((player) => player.vote);

      // Count votes
      const playerVotes = new Map<string, number>();
      for (const playerId of votes) {
        if (playerId === null) continue;
        playerVotes.set(playerId, (playerVotes.get(playerId) || 0) + 1);
      }

      // Get max votes
      const maxVotes = Math.max(...playerVotes.values());
      const maxVotedPlayers = [...playerVotes.entries()].filter(([, votes]) => votes === maxVotes).map(([id]) => id);

      // Get max voted player
      if (maxVotedPlayers.length === 1) {
        const p = game._players.get(maxVotedPlayers[0]);
        if (!p) throw new InternalError("playerNotFound");
        
        // Reveal and kill player
        p.alive = false;
        p.revealed = true;
        game._lastKilled = p.id;
      }
    },
    transition(game, isTimeup) {
      if (isTimeup) {
        if ((game._winner = IsGameOver(game))) return Phases.GAME_END;
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
    onEnter(game) {
      // Mafia kills a player
      const votes = game._players.mafia.map((player) => player.vote).filter((id) => id !== null);
      const playerVotes = new Map<string, number>(game._players.all.map((player) => [player.id, 0]));

      for (const playerId of votes) {
        if (playerId === null) continue;
        playerVotes.set(playerId, (playerVotes.get(playerId) || 0) + 1);
      }

      // Get max votes
      const maxVotes = Math.max(...playerVotes.values());
      const maxVotedPlayers = [...playerVotes.entries()].filter(([, votes]) => votes === maxVotes).map(([id]) => id);

      // If there are multiple max voted players, choose one randomly
      const id = maxVotedPlayers.length > 1 ? Math.floor(Math.random() * maxVotedPlayers.length) : 0;

      // Kill the player
      const playerId = maxVotedPlayers[id];
      const player = game._players.get(playerId);
      if (!player) throw new InternalError("playerNotFound");
      player.alive = false;
      game._lastKilled = player.id;
    },
    transition(game, isTimeup) {
      if (isTimeup) {
        if ((game._winner = IsGameOver(game))) return Phases.GAME_END;
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

function IsGameOver(game: Game): "mafia" | "citizens" | null {
  const mafiaCount = game._players.mafia.filter((player) => player.alive).length;
  const citizensCount = game._players.citizens.filter((player) => player.alive).length;

  if (mafiaCount >= citizensCount) {
    return "mafia";
  }
  if (mafiaCount === 0) {
    return "citizens";
  }

  return null;
}
