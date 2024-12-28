import { MASocket } from "@local/Sockets";
import { manager } from "./RoomManager";
import { Player } from "./Player";
import { Roles } from "@global/Roles";
import { Phases } from "@global/Game";

export default function socketRoutes(socket: MASocket) {
  // these variables are valid because of auth middleware
  const code = socket.handshake.query.code as string;
  const room = manager.getRoom(code)!;

  console.log(`${socket.id} joinRoom ${code}`);
  socket.join(code);

  socket.emit("phaseChange", room.phase);

  const playerid = manager.generatePlayerId();

  room.addPlayer(
    new Player(`player-${playerid}`, playerid, Roles.REGULAR_CITIZEN)
  );

  socket.on("vote", (data) => {
    socket.emit("info", `You voted for ${data}`);
  });
}
