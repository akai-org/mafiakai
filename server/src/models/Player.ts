import { Persona } from "@global/Persona";
import { Roles } from "@global/Roles";
import { PlayerModel } from "@global/PlayerModel";

export class Player implements PlayerModel {
  online: boolean = true;
  persona: Persona = {};
  role: Roles | null = null;
  seat: number | null = null;
  name: string | null = null; // Real name of the player
  isReady: boolean = false;

  constructor(public id: string) {}
}