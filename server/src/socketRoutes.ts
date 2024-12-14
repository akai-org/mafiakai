import { MASocket } from "./types/Sockets";

export default function socketRoutes(socket: MASocket) {
  socket.on("vote", (data) => {
    socket.emit("info", `You voted for ${data}`);
  });
}
