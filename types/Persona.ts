import type { Roles } from "./Roles";

export interface Persona {
  name: string;
  profession: string;
  description: string;
  preferences: "" | Roles.REGULAR_CITIZEN | Roles.MAFIOSO;
}
