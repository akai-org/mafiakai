import { ExtendedError } from "socket.io";
import { MASocket } from "@local/Sockets";
import { manager } from "./RoomManager";
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

  console.log(room);

  const playerId = socket.handshake.auth.playerId;
  // const session = sessionStore.findSession(sessionId);

  //console.log(`server-side socketAuth. sid: ${sessionId}`);
  console.log("hanshake id: " + playerId);
  console.log(JSON.stringify(room.getPlayers()));

  // Join as old player
  if (room.hasPlayer(playerId)) {
    console.log("JOIN AS OLD PLAYER");
    socket.data = { playerId, roomCode: code };
    return next();
  }

  // Join as new player
  if (NON_STRICT_PHASES.includes(room.phase)) {
    console.log("JOIN AS NEW PLAYER");
    //  const newSessionId = manager.genSessionId();
    const newPlayerId = manager.generatePlayerId();
    room.addPlayer(newPlayerId); //creates new player and assigns to room
    //   console.log(room.hasPlayer(newPlayerId));
    //  sessionStore.saveSession(newSessionId, {
    //  playerId: newPlayerId,
    //});
    // console.log(sessionStore.findSession(newSessionId)?.playerId === newPlayerId);

    socket.data = { playerId: newPlayerId, roomCode: code };
    console.log("room: " + JSON.stringify(room.getPlayers()));

    return next();
  }

  // Can't join
  return next(new Error(`Room ${code} does not accept new players currently`));
}
