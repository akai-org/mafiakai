import { ExtendedError } from "socket.io";
import { MASocket } from "@/types";
import { manager } from "@/constants";
import { NON_STRICT_PHASES } from "@global/Game";

/*
 Validate connection and Join player to room
 To establish a connection, the client must provide:
  - code - the room code
  - name - the player name
  - id - old player id or 0 for new player
*/
export default function socketAuth(socket: MASocket, next: (err?: ExtendedError) => void) {
  // Code
  const code = socket.handshake.query.roomCode;
  if (code === undefined) return next(new Error("Invalud code provided"));
  if (typeof code !== "string") return next(new Error("Invalid code provided"));

  // Room
  const room = manager.getRoom(code);
  if (room === undefined) return next(new Error(`Room ${code} does not exist`));

  const playerId = socket.handshake.auth.playerId;

  // Join as old player
  if (room.hasPlayer(playerId)) {
    socket.data = { playerId, roomCode: code };
    return next();
  }

  // Join as new player
  if (NON_STRICT_PHASES.includes(room.phase)) {
    const newPlayerId = manager.generatePlayerId();
    room.addPlayer(newPlayerId);

    socket.data = { playerId: newPlayerId, roomCode: code };
    return next();
  }

  // Can't join
  return next(new Error(`Room ${code} does not accept new players currently`));
}
