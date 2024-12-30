import { MASocket } from "@local/Sockets";
import { manager } from "../RoomManager";
import { Player } from "../Player";
import { Roles } from "@global/Roles";
import { Phases } from "@global/Game";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  const room = manager.getRoom(socket.data.roomCode)!;
  const playerid = socket.data.playerId;

  socket.emit("phaseChange", room.phase);

  socket.emit(
    "info",
    JSON.stringify({
      playerId: playerid,
      roomCode: room.code,
    })
  );

  socket.on("disconnect", () => {
    room.removePlayer(playerid);
  });
}
