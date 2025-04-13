import { manager } from "@/constants/manager";
import { MASocket } from "@/types";
import { Persona } from "@global/Persona";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  const room = manager.getRoom(socket.data.roomCode)!;
  const playerId = socket.data.playerId;
  console.log(`Player ${playerId} joined room ${room.code}`);

  room.game.execute("join", playerId); // Join the game
  socket.join(room.code); // Join socket.io room
  socket.join(playerId); // Join socket.io room for the player

  // Bind game events to socket events
  socket.on("setReady", (readiness) => room.game.execute("ready", socket.data.playerId, readiness));
  socket.on("setSeat", (position: number) => room.game.execute("seatAt", socket.data.playerId, position));
  socket.on("setPlayerName", (name: string) => room.game.execute("name", socket.data.playerId, name));
  socket.on("vote", (targetId: string) => room.game.execute("vote", socket.data.playerId, targetId));
  socket.on("updatePersona", (persona: Persona) => room.game.execute("describePlayer", socket.data.playerId, persona));

  socket.on("disconnect", () => room.game.execute("leave", playerId));

  // Initial event emission to the client
  socket.emit("sendPlayerId", playerId);
  room.game._output.updatePhase(room.game);
}
