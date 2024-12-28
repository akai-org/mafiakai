import { ExtendedError } from "socket.io";
import { MASocket } from "@local/Sockets";
import { manager } from "./RoomManager";
import { Phases } from "@global/Game";

// Connection validation
export default function socketAuth(
  socket: MASocket,
  next: (err?: ExtendedError) => void
) {
  // check if code is valid
  const code = socket.handshake.query.code;

  if (code === undefined) return next(new Error("No code provided"));
  if (typeof code !== "string") return next(new Error("Invalid code provided"));

  // check if room exists
  const room = manager.getRoom(code);
  if (room === undefined) return next(new Error(`Room ${code} does not exist`));

  // check if player can join
  if (
    ![
      Phases.LOBBY,
      Phases.POSITION_SELECTION,
      Phases.CHARACTER_SELECTION,
      Phases.ROLE_ASSIGNMENT,
      Phases.WELCOME,
    ].includes(room.phase)
  )
    return next(
      new Error(`ERROR: Room ${code} does not accept new players currently`)
    );

  return next();
}
