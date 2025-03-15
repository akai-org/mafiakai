import { Phases } from "@global/Game";

// export default {
//   PORT: parseInt(process.env.PORT || "5000"),
//   HOST: process.env.HOST || "localhost",
//   GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS: 4,
//   MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START: 4,
//   TIMEOUTS_MS: {
//     [Phases.ROLE_ASSIGNMENT]: 30_000,
//     [Phases.WELCOME]: 15_000,
//     [Phases.DEBATE]: 120_000,
//     [Phases.VOTING]: 30_000,
//     [Phases.ROLE_REVEAL]: 15_000,
//     [Phases.NIGHT]: 5_000,
//     [Phases.BODYGUARD_DEFENSE]: 30_000,
//     [Phases.DETECTIVE_CHECK]: 30_000,
//     [Phases.MAFIA_VOTING]: 30_000,
//     [Phases.ROUND_END]: 15_000,
//     [Phases.GAME_END]: 60_000,
//   } as Record<Phases, number>,
// };

export default {
  PORT: parseInt(process.env.PORT || "5000"),
  HOST: process.env.HOST || "localhost",
  GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS: 4,
  MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START: 4,
  TIMEOUTS_MS: {
    [Phases.ROLE_ASSIGNMENT]: 100,
    [Phases.WELCOME]: 100,
    [Phases.DEBATE]: 100,
    [Phases.VOTING]: 100,
    [Phases.ROLE_REVEAL]: 100,
    [Phases.NIGHT]: 100,
    [Phases.BODYGUARD_DEFENSE]: 100,
    [Phases.DETECTIVE_CHECK]: 100,
    [Phases.MAFIA_VOTING]: 100,
    [Phases.ROUND_END]: 100,
    [Phases.GAME_END]: 100,
  } as Record<Phases, number>,
};
