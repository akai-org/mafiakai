import { manager } from "@/constants/manager";
import { MASocket } from "@/types";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  const room = manager.getRoom(socket.data.roomCode)!;
  const playerId = socket.data.playerId;
  console.log(`Player ${playerId} joined room ${room.code}`);

  room.game.join(playerId); // Join the game
  socket.join(room.code); // Join socket.io room
  socket.join(playerId); // Join socket.io room for the player

  // Bind game events to socket events
  socket.on("setReady", (readiness) => room.game.ready(socket.data.playerId, readiness));
  socket.on("setSeat", (position: number) => room.game._players.setSeatFor(socket.data.playerId, position));
  socket.on("setPlayerName", (name: string) => room.game._players.setNameFor(socket.data.playerId, name));
  socket.on("vote", (targetId: string) => room.game.vote(socket.data.playerId, targetId));

  socket.on("disconnect", () => room.game.leave(playerId));

  setTimeout(() => {
    room.game._state.updatePhase(room.game);
  }, 1000);
}
