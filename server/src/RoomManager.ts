import { Room } from "./Room";

class RoomManager {
  rooms = new Map<string, Room>();
  private playerIdCounter = 1;

  // unique 5 digits room code
  generateCode(): string {
    let code;
    do {
      code = (Math.floor(Math.random() * 90000) + 10000).toString();
    } while (this.rooms.has(code));
    return code;
  }

  generatePlayerId(): string {
    return `player-${this.playerIdCounter++}`;
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
