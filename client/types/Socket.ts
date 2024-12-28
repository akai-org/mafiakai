import {
  type Client2ServerEvents,
  type Server2ClientEvents,
} from "@global/Sockets";
import { Socket } from "socket.io-client";

export type CustomSocket = Socket<Server2ClientEvents, Client2ServerEvents>;

export interface ConnectionContext {
  socket: CustomSocket;
}
