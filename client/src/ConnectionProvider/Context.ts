import { createContext } from "react";
import { connect } from "socket.io-client";
import type { ConnectionContext, CustomSocket } from "types/Socket";

export const socket: CustomSocket = connect("ws://localhost:5000", {
  autoConnect: false,
});

export const ConnContext = createContext<ConnectionContext>({
  socket,
});
