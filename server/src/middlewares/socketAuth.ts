import { ExtendedError } from "socket.io";
import { MASocket } from "@/types";
import { manager } from "@/constants";
import { Phases } from "@global/Phases";

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

  const playerId = socket.handshake.auth.playerId;

  // Join as old player
  if (room.hasPlayer(playerId)) {
    socket.data = { playerId, roomCode: code };
    socket.join(playerId); // Assign player to their own private room
    socket.join(room.code); // Assign player to socket room
    return next();
  }

  // Join as new player
  if (room.phase === Phases.LOBBY) {
    const newPlayerId = manager.generatePlayerId();
    room.addPlayer(newPlayerId);

    socket.data = { playerId: newPlayerId, roomCode: code };
    socket.join(playerId); // Assign player to their own private room
    socket.join(room.code); // Assign player to socket room
    return next();
  }

  // Can't join
  return next(new Error(`Room ${code} does not accept new players currently`));
}
