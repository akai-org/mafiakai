import { manager } from "@/constants/manager";
import { MASocket } from "@/types";
import { ExtendedError } from "socket.io";

/*
 Validate connection and Join player to room
 To establish a connection, the client must provide:
  - code - the room code
  - id - old player id or undefined
*/
export default function socketAuth(socket: MASocket, next: (err?: ExtendedError) => void) {
  // Code
  const code = socket.handshake.query.roomCode;
  if (code === undefined) return next(new Error("Invalid code provided"));
  if (typeof code !== "string") return next(new Error("Invalid code provided"));

  // Room
  const room = manager.getRoom(code);
  if (room === undefined) return next(new Error(`Room ${code} does not exist`));

  // Player Id
  let playerId = socket.handshake.auth.playerId;
  if (playerId === undefined) playerId = manager.generatePlayerId();
  socket.data = { playerId: playerId, roomCode: code };

  return next();
}
