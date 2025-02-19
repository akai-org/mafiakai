import { Persona } from "@global/Persona";
import { Roles } from "@global/Roles";

export class Player {
  online: boolean = true;
  persona: Persona = {};
  role: Roles | null = null;
  seat: number | null = null;
  name: string | null = null; // Real name of the player
  isReady: boolean = false;

  constructor(
    public id: string // Unique identifier for the player
  ) {}
}
