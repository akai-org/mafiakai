import { SID_KEY_NAME, socket } from "@/constants";

const connect = (roomCode: string) => {
  if (socket.connected) return;

  const playerId = localStorage.getItem(SID_KEY_NAME);

  if (playerId) {
    socket.auth = { playerId };
  }

  console.log(`socket.auth: ${JSON.stringify(socket.auth)} playerId: ${playerId}`);

  socket.io.opts.query = { roomCode };
  socket.connect();
};

const disconnect = () => {
  socket.disconnect();
};

export { connect, disconnect };
