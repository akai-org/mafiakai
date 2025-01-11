import { MASocket } from "@local/Sockets";
import { manager } from "../RoomManager";
import { NON_STRICT_PHASES } from "@global/Game";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  const room = manager.getRoom(socket.data.roomCode);
  const playerId = socket.data.playerId;

  socket.emit("conn_info_data", {
    playerId: socket.data.playerId,
  });

  if (!room) {
    socket.emit("phase_updated", { err: "Room is not found", phase: NON_STRICT_PHASES[0] });
  } else {
    socket.emit("phase_updated", { err: "", phase: room.phase });
  }

  socket.on("disconnect", () => {
    room?.disconnectPlayer(playerId);
  });
}
