import { MASocket } from "@/types";
import { manager } from "@/constants";
import { Player, Room } from "@/models";
import { Phases } from "@global/Game";
import { Roles } from "@global/Roles";

function null_or_undefined(x: any | null | undefined) {
  return x === null || x === undefined;
}

function some_player_is_not_ready(players: Player[]): boolean {
  return players.some((x: Player) => {
    return !x.isReady || null_or_undefined(x.name) || null_or_undefined(x.seat);
  });
}

const MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START: number = 4;
function check_is_room_ready(room: Room): boolean {
  const players = room.getPlayers();
  return players.length >= MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START && !some_player_is_not_ready(players);
}

// Fisher-Yates Sorting Algorithm, pseudorandom only
function shuffle(array: any[]): Array<any> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS = 4;
// For every 4 people add another mafia player
// n mod 4 / 4 = chance to pick another mafia player
// There is always 1 detective and 1 bodyguard
function establish_roles(room: Room): boolean {
  const players = room.getPlayers();
  const n = players.length;
  if (n < MINIMUM_NUMBER_OF_READY_PLAYERS_TO_START){
    return false;
  }

  // Since after shuffling the array the order of players should be random enough
  // the arbitrary indices can be modified to other numbers, but the ranges must be disjoint.
  const players_shuffled = shuffle(players);
  const detective = players_shuffled.at(0).id;
  const bodyguard = players_shuffled.at(1).id;

  const guaranteed_number_of_mafia = Math.floor(n/GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS);
  const chance_for_another_mafioso = (n % GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS)/GUARANTEED_MAFIA_FOR_EACH_N_PLAYERS;
  const another_mafioso = (Math.random() < chance_for_another_mafioso) ? 1 : 0;
  const mafia_range_upper_bound_exclusive = 2+guaranteed_number_of_mafia+another_mafioso;
  const mafia: Array<string> = players_shuffled.slice(2,mafia_range_upper_bound_exclusive).map((p: Player)=>{return p.id});

  const regular_citizens = players_shuffled.slice(mafia_range_upper_bound_exclusive,n);

  room.setPlayerRole(detective,Roles.DETECTIVE);
  room.setPlayerRole(bodyguard,Roles.BODYGUARD);
  for (const m of mafia){
    room.setPlayerRole(m,Roles.MAFIOSO);
  }
  for (const c of regular_citizens){
    room.setPlayerRole(c,Roles.REGULAR_CITIZEN);
  }

  return true;
}

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

  if (check_is_room_ready(room)) {
    const one_second = 1_000;
    socket.to(room.code).emit("planned_phase_change", Phases.ROLE_ASSIGNMENT, Date.now() + one_second);
    setTimeout(() => {
      room.phase = Phases.ROLE_ASSIGNMENT;
      socket.to(room.code).emit("phase_updated", room.phase);
      if (!establish_roles(room)){
        console.log("Inconsistent limits for the minimum number of players");
        return;
      } 
      for (const p of room.getPlayers()){
        // Generate rooms for each [(specific role) intersection (game room)]
        // Add players to these rooms
        socket.to(p.id).emit("set_player_role",p.role!);
      }
    }, one_second);
  }

  socket.on("send_player_name", (playerName) => {
    room.getPlayer(playerId)!.name = playerName;
  });

  socket.on("set_position", (position: number, callback) => {
    room.setPlayerSeat(playerId, position);
    callback(`OK: seated at ${position}`);
  });

  socket.on("vote", (data: string) => {});
}
