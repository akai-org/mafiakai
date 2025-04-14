import { socketsServer } from "@/routes";
import { Room } from "./Room";
import crypto from "node:crypto";

export class RoomManager {
  rooms = new Map<string, Room>();

  constructor() {
    // Create the default test rooms
    const roomsCodes = ["000000", "000001"];
    for (const code of roomsCodes) this.create(code);

    const r1 = this.rooms.get("000001");
    if (!r1) return;

    const p1 = this.generatePlayerId();
    r1.game.execute("join", p1);
    r1.game.execute("name", p1, "Player 1");
    r1.game.execute("seatAt", p1, 0);
    r1.game.execute("ready", p1, true);

    const p2 = this.generatePlayerId();
    r1.game.execute("join", p2);
    r1.game.execute("name", p2, "Player 2");
    r1.game.execute("seatAt", p2, 0);
    r1.game.execute("ready", p2, true);
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
