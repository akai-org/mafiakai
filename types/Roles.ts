/**
 * Role są tajnymi funkcjami pełnionymi przez wybranych losowo graczy.
 * Przynależność danego gracza do wybranej roli nie jest powszechnie znana, poza wypisanymi niżej wyjątkami.
 */
export enum Roles{
    /**
     * Gracze pełniący rolę mafii mogą głosować w trakcie fazy MAFIA_VOTING za eliminacją wybranego obywatela.
     * Przynależność do mafii jest tajna poza jej kręgiem członków.
     * Rola jest pełniona grupowo.
     */
    MAFIOSO = "MAFIOSO",

    /**
     * Detektyw posiada możliwość sprawdzenia tożsamości danego gracza (jego roli) w fazie DETECTIVE_CHECK.
     * Nie posiada on jednak ważniejszych zdolności egzekucyjnych poza publiczną debatą (DEBATE) i publicznym głosowaniem (VOTING).
     * Z oczywistych względów narażony na ataki mafii w przypadku wyjawienia tożsamości.
     * Rola jest pełniona indywidualnie.
     */
    DETECTIVE = "DETECTIVE",

    /**
     * Ochroniarz w trakcie fazy BODYGUARD_DEFENSE wybiera jedną osobę, którą chroni przed atakiem mafii.
     * Może on także wybrać siebie.
     * Rola jest pełniona indywidualnie.
     */
    BODYGUARD = "BODYGUARD",

    /**
     * Każdy z graczy ma możliwość uczestniczenia w standardowych fazach dnia (DAY), debaty (DEBATE), głosowania (VOTING, VOTING_OVERTIME).
     * 
     * Rola jest pełniona grupowo i jest domyślnym wariantem,
     * której funkcje spełniają także gracze przypisani do wyżej wymienionych ról.
     */
    REGULAR_CITIZEN = "REGULAR_CITIZEN"
};