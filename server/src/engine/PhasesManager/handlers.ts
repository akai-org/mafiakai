import { Phases } from "@global/Game";
import { PhaseHandler } from "./PhasesManager";
import { config } from "@/constants";

export const phaseHandlers: Record<Phases, PhaseHandler> = {
  [Phases.LOBBY]: {
    onEnter(game) {
      // TODO: reset the game state
    },
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

      // Wait until the timeout
      /*
        Alternatively, the timer should start after every `onEnter()` call
        Phases without a timeout should have a `null` value in the `TIMEOUTS_MS` object
        But there is only one phase without a timeout in the current implementation
        Which requires players to be ready

        or

        callback function of timer should always be defined as `() => game.phase.update(game)`
      */
      game.timer.start(config.TIMEOUTS_MS[Phases.ROLE_ASSIGNMENT], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning) return Phases.WELCOME;
      return null;
    },
  },
  [Phases.WELCOME]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.WELCOME], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning) return Phases.DEBATE;
      return null;
    },
  },
  [Phases.DEBATE]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.DEBATE], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning) return Phases.VOTING;
      return null;
    },
  },
  [Phases.VOTING]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.VOTING], () => game.phase.update(game));
    },
    transition(game) {
      const allVoted = game.players.all.every((player) => player.vote !== null);
      if (!game.timer.isRunning || allVoted) return Phases.ROLE_REVEAL;
      return null;
    },
  },
  [Phases.ROLE_REVEAL]: {
    onEnter(game) {
      // TODO:
      // - kill player and reveal the role of the player
      // or
      // - nobody dies

      game.timer.start(config.TIMEOUTS_MS[Phases.ROLE_REVEAL], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning) {
        // TODO: Check if the game is over (over ? Phases.GAME_END : Phases.NIGHT)

        return Phases.NIGHT;
      }
      return null;
    },
  },
  [Phases.NIGHT]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.NIGHT], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning) return Phases.BODYGUARD_DEFENSE;
      return null;
    },
  },
  [Phases.BODYGUARD_DEFENSE]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.BODYGUARD_DEFENSE], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning || game.phase.getFlag("bodyguardAppointed")) {
        game.phase.lowerFlags(); // It could be done every time the phase is changed
        return Phases.DETECTIVE_CHECK;
      }
      return null;
    },
  },
  [Phases.DETECTIVE_CHECK]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.DETECTIVE_CHECK], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning || game.phase.getFlag("detectiveAppointed")) {
        game.phase.lowerFlags();
        return Phases.MAFIA_VOTING;
      }
      return null;
    },
  },
  [Phases.MAFIA_VOTING]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.MAFIA_VOTING], () => game.phase.update(game));
    },
    transition(game) {
      const allVoted = game.players.mafia.every((player) => player.vote !== null);
      if (!game.timer.isRunning || allVoted) return Phases.ROUND_END;
      return null;
    },
  },
  [Phases.ROUND_END]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.ROUND_END], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning) {
        // TODO: Check if the game is over (over ? Phases.GAME_END : Phases.DEBATE)
        return Phases.DEBATE;
      }
      return null;
    },
  },
  [Phases.GAME_END]: {
    onEnter(game) {
      game.timer.start(config.TIMEOUTS_MS[Phases.GAME_END], () => game.phase.update(game));
    },
    transition(game) {
      if (!game.timer.isRunning) return Phases.LOBBY;
      return null;
    },
  },
};
