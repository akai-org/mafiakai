import { Persona } from "@global/Persona";
import { Roles } from "@global/Roles";

export class Player {
  online: boolean = true;
  persona: Persona = {};
  role: Roles | null = null;
  seat: number | null = null;

  constructor(
    public id: string // Unique identifier for the player
    //TODO: handle player name on client and server
    // public name: string // Real name of the player
  ) {}
}
