import { socket } from "@/constants";
import type { SocketQueryParams } from "@/types/Socket";

const connect = (queryParams: SocketQueryParams) => {
  if (socket.connected) return;

  socket.io.opts.query = queryParams;
  socket.connect();
};

const disconnect = () => {
  socket.disconnect();
};

export { connect, disconnect };
