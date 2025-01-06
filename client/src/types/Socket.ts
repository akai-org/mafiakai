import { type Client2ServerEvents, type Server2ClientEvents } from "@global/Sockets";
import { Socket } from "socket.io-client";

export type CustomSocket = Socket<Server2ClientEvents, Client2ServerEvents>;

export interface ConnectionContext {
  socket: CustomSocket;
  connect: (queryParams: SocketQueryParams) => void;
  disconnect: () => void;
}

export interface SocketQueryParams {
  code: string;
  name: string;
  id: string;
}
