import { MASocket } from "@local/Sockets";
import { manager } from "../RoomManager";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  const room = manager.getRoom(socket.data.roomCode)!;
  const playerId = socket.data.playerId;

  socket.emit("conn_info_data", {
    playerId: socket.data.playerId,
  });

  socket.emit("phase_updated", room.phase);

  socket.on("disconnect", () => {
    room?.disconnectPlayer(playerId);
  });
}
