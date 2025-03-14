import { Persona } from "@global/Persona";
import { PlayerModel } from "@global/PlayerModel";
import { Roles } from "@global/Roles";

export class Player implements PlayerModel {
  online: boolean = true;
  persona: Persona = {};
  role: Roles | null = null;
  seat: number | null = null;
  name: string | null = null; // Real name of the player
  alive: boolean = true;
  isReady: boolean = false;

  /** Vote changes its meaning depending on the game state [VOTING, MAFIA_VOTING] */
  vote: string | null = null;

  constructor(public id: string) {}
}
