import { ExtendedError } from "socket.io";
import { MASocket } from "@local/Sockets";

// Connection validation
export default function socketAuth(
  socket: MASocket,
  next: (err?: ExtendedError) => void
) {
  next();
}
