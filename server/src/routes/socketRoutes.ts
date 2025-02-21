import { MASocket } from "@/types";
import { manager } from "@/constants";
import { Phases } from "@global/Game";

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


  socket.on("set_ready", () => {
    room.getPlayer(playerId)!.isReady = true;
  });

  socket.on("send_player_name", (playerName) => {
    room.getPlayer(playerId)!.name = playerName;
  });

  socket.on("set_position", (position: number) => {
    room.setPlayerSeat(playerId, position);
  });

  socket.on("vote", (data: string) => {});
}
