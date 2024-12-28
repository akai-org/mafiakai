import { Roles } from "@global/Roles";

export class Player {
  constructor(
    public name: string,
    public id: number,
    public role: Roles
  ) {}
}
