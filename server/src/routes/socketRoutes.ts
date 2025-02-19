import { MASocket } from "@/types";
import { manager } from "@/constants";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  //TODO: Should player be assigned to socket room too?
  const room = manager.getRoom(socket.data.roomCode)!;
  const playerId = socket.data.playerId;

  socket.emit("conn_info_data", {
    playerId: socket.data.playerId,
  });

  socket.emit("phase_updated", room.phase);

  socket.on("disconnect", () => {
    room?.disconnectPlayer(playerId);
  });

  socket.on("send_player_name", (playerName) => {
    room.getPlayer(playerId)!.name = playerName;
  });
}
