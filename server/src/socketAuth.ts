import { ExtendedError } from "socket.io";
import { MASocket } from "@local/Sockets";
import { manager } from "./RoomManager";
import { NON_STRICT_PHASES, Phases } from "@global/Game";

/*
 Validate connection and Join player to room
 To establish a connection, the client must provide:
  - code - the room code
  - name - the player name
  - id - old player id or 0 for new player
*/
export default function socketAuth(socket: MASocket, next: (err?: ExtendedError) => void) {
  // VALIDATING

  // Code
  const code = socket.handshake.query.code;
  if (code === undefined) return next(new Error("Invalud code provided"));
  if (typeof code !== "string") return next(new Error("Invalid code provided"));

  // Room
  const room = manager.getRoom(code);
  if (room === undefined) return next(new Error(`Room ${code} does not exist`));

  // Player Name
  const name = socket.handshake.query.name;
  if (name === undefined) return next(new Error("Invalid player name provided"));
  if (typeof name !== "string") return next(new Error("Invalid player name provided"));

  // Player Id
  const id = socket.handshake.query.id;
  if (id === undefined) return next(new Error("Invalid player id provided"));
  if (typeof id !== "string") return next(new Error("Invalid player id provided"));

  let playerId = parseInt(id);
  if (isNaN(playerId)) return next(new Error("Invalid player id provided"));

  // JOINING ROOM

  // Join as new player
  if (NON_STRICT_PHASES.includes(room.phase)) {
    // Create new player
    playerId = manager.generatePlayerId();
    room.addPlayer(playerId, name);

    socket.data = { playerId, roomCode: code };
    return next();
  }

  // Join as old player
  if (room.hasPlayer(playerId)) {
    socket.data = { playerId, roomCode: code };
    return next();
  }

  // Can't join
  return next(new Error(`Room ${code} does not accept new players currently`));
}
