import { socketsServer } from "@/routes";
import { Room } from "./Room";
import crypto from "node:crypto";

export class RoomManager {
  rooms = new Map<string, Room>();

  constructor() {
    // Create the default test rooms
    this.createTestRoom("000000", 0);
    this.createTestRoom("000001", 3);
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

  createTestRoom(code: string, players: number, names: string[] = []): Room {
    const room = this.create(code);
    for (let i = 0; i < players; i++) {
      const playerId = this.generatePlayerId();
      room.game.execute("join", playerId);
      room.game.execute("name", playerId, names[i] ?? `Player ${i + 1}`);
      room.game.execute("seatAt", playerId, i);
      room.game.execute("ready", playerId, true);
    }
    return room;
  }
}
