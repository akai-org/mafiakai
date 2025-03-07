import { MASocket } from "@/types";
import { manager } from "@/constants";
import { Phases } from "@global/Game";
import { Roles } from "@global/Roles";

// Here we set up the socket events for the client
export default function socketRoutes(socket: MASocket) {
  const room = manager.getRoom(socket.data.roomCode)!;
  const playerId = socket.data.playerId;

  socket.emit("conn_info_data", {
    playerId: socket.data.playerId,
  });

  socket.emit("phase_updated", room.phase);

  room.update();

  socket.on("disconnect", () => {
    // Potential race condition - need to lock changing phases / temporarily disable timeout
    room?.disconnectPlayer(playerId);
    room.update();
  });

  socket.on("set_ready", () => {
    if (room.phase === Phases.LOBBY) {
      // Potential race condition - need to lock changing phases / temporarily disable timeout
      room.getPlayer(playerId)!.isReady = true;
    } else {
      // Invalid request
      return;
    }

    room.update();
  });

  socket.on("send_player_name", (playerName) => {
    if (room.phase === Phases.LOBBY) {
      // Potential race condition - need to lock changing phases / temporarily disable timeout
      room.getPlayer(playerId)!.name = playerName;
    } else {
      // Invalid request
      return;
    }
    room.update();
  });

  socket.on("set_position", (position: number) => {
    // Potential race condition - need to lock changing phases / temporarily disable timeout
    room.setPlayerSeat(playerId, position);
    room.update();
  });

  socket.on("vote", (player_id: string) => {
    const vote = room.getPlayer(player_id);
    if (vote === undefined) {
      // Invalid request
      return;
    }

    const this_player = room.getPlayer(playerId)!;

    // Potential race condition - need to lock changing phases / temporarily disable timeout
    if (room.phase === Phases.VOTING) {
      // Potential race condition - need to lock updating room.game.common_vote
      const prev = room.game.common_vote.get(vote.id) ?? 0;
      room.game.common_vote.set(vote.id, prev + 1);
    } else if (room.phase === Phases.MAFIA_VOTING && this_player.role === Roles.MAFIOSO) {
      // Potential race condition - need to lock updating room.game.common_vote
      const prev = room.game.mafia_vote.get(vote.id) ?? 0;
      room.game.mafia_vote.set(vote.id, prev + 1);
    } else if (room.phase === Phases.BODYGUARD_DEFENSE && this_player.role === Roles.BODYGUARD) {
      room.game.chosen_by_bodyguard = vote.id;
    } else if (room.phase === Phases.DETECTIVE_CHECK && this_player.role === Roles.DETECTIVE) {
      room.game.chosen_by_detective = vote.id;
    } else {
      // Invalid request
      return;
    }

    room.update();
  });
}
