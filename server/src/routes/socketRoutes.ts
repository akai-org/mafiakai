import { MASocket } from "@/types";
import { manager } from "@/constants";
import { Player, Room } from "@/models";
import { Phases } from "@global/Game";

function some_player_is_not_ready(players: Player[]): boolean {
  return players.some((x: Player)=>{return !x.isReady;});
}

const MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START: number = 4;
function check_is_room_ready(room: Room): boolean {
  const players = room.getPlayers();
  return players.length >= MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START && !some_player_is_not_ready(players);
}


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

  if (check_is_room_ready(room)){
    const seconds10 = 10_000;
    socket.to(room.code).emit("planned_phase_change", Phases.ROLE_ASSIGNMENT, Date.now()+seconds10)
    setTimeout(()=>{
      room.phase = Phases.ROLE_ASSIGNMENT;
      socket.to(room.code).emit("phase_updated",room.phase);
    }, seconds10);
  }

  socket.on("send_player_name", (playerName) => {
    room.getPlayer(playerId)!.name = playerName;
  });

  socket.on("set_position", (position: number, callback) => {
    room.setPlayerSeat(playerId, position);
    callback(`OK: seated at ${position}`);
  });

  socket.on("vote", (data: string) => {
   
  });
}
