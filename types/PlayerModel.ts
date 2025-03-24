import { Persona } from "./Persona";
import { Roles } from "./Roles";

export interface PlayerModel {
  id: string;

  role: Roles | null; // Only the player themself and the detective upon inspection know the role
  guarded: boolean; // Only bodyguard knows if player is guarded
  alive: boolean;

  isReady: boolean;
  online: boolean;

  name: string | null; // Real name of the player
  persona: Persona;

  seat: number | null;
}
