import { Persona } from "@global/Persona";
import { Roles } from "@global/Roles";

export interface PlayerModel {
  id: string;
  online: boolean;
  persona: Persona;
  role: Roles | null;
  seat: number | null;
  name: string | null; // Real name of the player
  isReady: boolean;
}
