import { MASocket } from "@/types";
import { manager } from "@/constants/manager";
import { Phases } from "@global/Phases";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  const room = manager.getRoom(socket.data.roomCode)!;
  const playerId = socket.data.playerId;

  // Join to game

  socket.emit("conn_info_data", { playerId: socket.data.playerId });
  room.game.join(playerId);

  // Bind game state to client
  room.game.onphasechange = (phase) => socket.emit("newPhase", phase);
  room.game.onplayerschange = (toPlayerId, players) => {
    if (playerId === toPlayerId) socket.emit("newPlayers", players);
  };
  room.game.onerror = (error) => socket.emit("newError", error);

  room.game.update();

  socket.on("disconnect", () => {
    room?.game.leave(playerId);
    room.game.update();
  });

  socket.on("set_ready", () => {
    room.game.ready(playerId,true);
    room.game.update();
  });

  socket.on("send_player_name", (playerName) => {
    room.game.name(playerId,playerName);
    room.game.update();
  });

  socket.on("set_position", (position: number) => {
    room.game.seatAt(playerId, position);
    room.game.update();
  });

  socket.on("vote", (player_id: string) => {
    room.game.vote(playerId,player_id);
    room.game.update();
  });
}
