import { socketsServer } from "@/routes";
import { Room } from "./Room";
import crypto from "node:crypto";

export class RoomManager {
  rooms = new Map<string, Room>();

  constructor() {
    // Create the default test rooms
    const roomsCodes = ["000000"];
    for (const code of roomsCodes) this.create(code);
  }

  // unique 5 digits room code
  generateCode(): string {
    let code;
    do {
      code = (Math.floor(Math.random() * 90000) + 100000).toString();
    } while (this.rooms.has(code));
    return code;
  }

  generatePlayerId(): string {
    return crypto.randomUUID();
  }

  create(code?: string): Room {
    code ??= this.generateCode();
    const room = new Room(code, socketsServer);
    this.rooms.set(code, room);
    return room;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }
}
