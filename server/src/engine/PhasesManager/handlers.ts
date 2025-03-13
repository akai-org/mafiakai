import { Phases } from "@global/Game";
import { PhaseHandler } from "./PhasesManager";
import { config } from "@/constants";

export const phaseHandlers: Record<Phases, PhaseHandler> = {
  [Phases.LOBBY]: {
    onEnter(game) {},
    transition(game) {
      const readyPlayersCount = game.players.all.filter((player) => player.isReady).length;
      if (readyPlayersCount >= config.MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START) {
        return Phases.ROLE_ASSIGNMENT;
      }

      return null;
    },
  },
  [Phases.ROLE_ASSIGNMENT]: {
    onEnter(game) {
      // TODO: Implement role assignment
    },
    transition(game) {
      return null;
    },
  },
  [Phases.WELCOME]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.DEBATE]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.VOTING]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.ROLE_REVEAL]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.NIGHT]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.BODYGUARD_DEFENSE]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.DETECTIVE_CHECK]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.MAFIA_VOTING]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.ROUND_END]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
  [Phases.GAME_END]: {
    onEnter(game) {},
    transition(game) {
      return null;
    },
  },
};
