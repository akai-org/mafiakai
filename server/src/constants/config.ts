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
    [Phases.ROLE_ASSIGNMENT]: parseInt(process.env.TIMEOUT_MS_ROLE_ASSIGNMENT || "30_000"),
    [Phases.WELCOME]: parseInt(process.env.TIMEOUT_MS_WELCOME || "15_000"),
    [Phases.DEBATE]: parseInt(process.env.TIMEOUT_MS_DEBATE || "120_000"),
    [Phases.VOTING]: parseInt(process.env.TIMEOUT_MS_VOTING || "30_000"),
    [Phases.ROLE_REVEAL]: parseInt(process.env.TIMEOUT_MS_ROLE_REVEAL || "15_000"),
    [Phases.NIGHT]: parseInt(process.env.TIMEOUT_MS_NIGHT || "5_000"),
    [Phases.BODYGUARD_DEFENSE]: parseInt(process.env.TIMEOUT_MS_BODYGUARD_DEFENSE || "30_000"),
    [Phases.DETECTIVE_CHECK]: parseInt(process.env.TIMEOUT_MS_DETECTIVE_CHECK || "30_000"),
    [Phases.MAFIA_VOTING]: parseInt(process.env.TIMEOUT_MS_MAFIA_VOTING || "30_000"),
    [Phases.ROUND_END]: parseInt(process.env.TIMEOUT_MS_ROUND_END || "15_000"),
    [Phases.GAME_END]: parseInt(process.env.TIMEOUT_MS_GAME_END || "60_000"),
  } as Record<Phases, number>,
};
