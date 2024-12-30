export enum Phases {
  /**
   * Faza LOBBY: Gracze dołączają do gry. Gra czeka, aż wszyscy gracze zgłoszą gotowość.
   */
  LOBBY = "LOBBY",

  /**
   * Faza POSITION_SELECTION: Gracze wybierają swoje pozycje (np. miejsca przy stole).
   * Jeśli wszyscy gracze są gotowi, gra przechodzi do CHARACTER_SELECTION.
   */
  POSITION_SELECTION = "POSITION_SELECTION",

  /**
   * Faza CHARACTER_SELECTION: Gracze wybierają swoje jawne postacie.
   * Jeśli wszyscy gracze są gotowi, gra przechodzi do ROLE_ASSIGNMENT.
   */
  CHARACTER_SELECTION = "CHARACTER_SELECTION",

  /**
   * Faza ROLE_ASSIGNMENT: Gracze otrzymują swoje tajne role (np. obywatel, mafia).
   * Po zakończeniu losowania, gra automatycznie przechodzi do WELCOME.
   */
  ROLE_ASSIGNMENT = "ROLE_ASSIGNMENT",

  /**
   * Faza WELCOME: Krótkie wprowadzenie do gry. Gracze mogą zapoznać się z zasadami.
   * Po określonym czasie gra automatycznie przechodzi do ROUND_START.
   */
  WELCOME = "WELCOME",

  /**
   * Faza ROUND_START: Oficjalne rozpoczęcie rundy. Trwa przez krótki czas, zanim gra przejdzie do DAY.
   */
  ROUND_START = "ROUND_START",

  /**
   * Faza DAY: Początek dnia w grze. Gracze mogą rozmawiać i analizować wydarzenia.
   * Po określonym czasie gra przechodzi do DEBATE.
   */
  DAY = "DAY",

  /**
   * Faza DEBATE: Gracze prowadzą debatę na temat swoich podejrzeń.
   * Po określonym czasie gra przechodzi do VOTING.
   */
  DEBATE = "DEBATE",

  /**
   * Faza VOTING: Gracze głosują na osobę, która ich zdaniem powinna zostać wyeliminowana.
   * Jeśli dwie lub więcej osób otrzyma taką samą największą liczbę głosów, gra przechodzi do VOTING_OVERTIME.
   * W przeciwnym razie, gra przechodzi do NIGHT.
   */
  VOTING = "VOTING",

  /**
   * Faza VOTING_OVERTIME: Dogrywka głosowania, gdy dwie lub więcej osób otrzymało największą liczbę głosów.
   * Po rozstrzygnięciu gra przechodzi do NIGHT.
   */
  VOTING_OVERTIME = "VOTING_OVERTIME",

  /**
   * Faza NIGHT: Gracze wykonują swoje nocne akcje.
   * Gra automatycznie przechodzi do BODYGUARD_DEFENSE.
   */
  NIGHT = "NIGHT",

  /**
   * Faza BODYGUARD_DEFENSE: Ochroniarz wybiera, kogo chce obronić przed atakiem mafii.
   * Jeśli ochroniarz wykona swoją akcję, gra przechodzi do DETECTIVE_CHECK.
   */
  BODYGUARD_DEFENSE = "BODYGUARD_DEFENSE",

  /**
   * Faza DETECTIVE_CHECK: Detektyw wybiera osobę, której tożsamość chce sprawdzić (obywatel/mafia).
   * Po wykonaniu akcji przez detektywa gra przechodzi do MAFIA_VOTING.
   */
  DETECTIVE_CHECK = "DETECTIVE_CHECK",

  /**
   * Faza MAFIA_VOTING: Mafia wspólnie wybiera osobę, którą chce wyeliminować.
   * Jeśli mafia dokona wyboru lub upłynie określony czas, gra przechodzi do ROUND_END.
   */
  MAFIA_VOTING = "MAFIA_VOTING",

  /**
   * Faza ROUND_END: Podsumowanie rundy. Gra pokazuje wyniki nocnych akcji (np. kto został zabity).
   * Jeśli wszyscy mafiozi zostali wyeliminowani lub liczba mafiozów >= liczba obywateli, gra przechodzi do GAME_END.
   * W przeciwnym razie gra wraca do DAY.
   */
  ROUND_END = "ROUND_END",

  /**
   * Faza GAME_END: Zakończenie gry. Gra pokazuje wyniki i zwycięzców (obywatele lub mafia).
   */
  GAME_END = "GAME_END",
}

/**
 * Fazy gry, do których mogą dołączyć nowi gracze.
 */
export const NON_STRICT_PHASES: ReadonlyArray<Phases> = [
  Phases.LOBBY,
  Phases.POSITION_SELECTION,
  Phases.CHARACTER_SELECTION,
];
