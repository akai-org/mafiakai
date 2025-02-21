export default {
  PORT: parseInt(process.env.PORT || "5000"),
  HOST: process.env.HOST || "localhost",
  GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS: 4,
  MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START: 4,
};
