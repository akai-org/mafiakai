import { Persona } from "@global/Persona";
import { Roles } from "@global/Roles";

export class Player {
  online: boolean = true;
  persona: Persona = {};
  role: Roles | null = null;
  seat: number | null = null;

  constructor(
    public id: number, // Unique identifier for the player
    public name: string // Real name of the player
  ) {}
}
