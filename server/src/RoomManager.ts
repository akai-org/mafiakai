import { Room } from "./Room";
import crypto from "node:crypto";

class RoomManager {
  rooms = new Map<string, Room>([["000000", new Room("000000")]]);

  // unique 5 digits room code
  generateCode(): string {
    let code;
    do {
      code = (Math.floor(Math.random() * 90000) + 10000).toString();
    } while (this.rooms.has(code));
    return code;
  }

  generatePlayerId(): string {
    return crypto.randomUUID();
  }

  create(): string {
    const code = this.generateCode();
    const room = new Room(code);
    this.rooms.set(code, room);
    return code;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }
}

export const manager = new RoomManager();
