import {
  Client2ServerEvents,
  InterServerEvents,
  Server2ClientEvents,
  SocketData,
} from "@global/Sockets";
import { Server, Socket } from "socket.io";

export type MAServer = Server<
  Client2ServerEvents,
  Server2ClientEvents,
  InterServerEvents,
  SocketData
>;

export type MASocket = Socket<
  Client2ServerEvents,
  Server2ClientEvents,
  InterServerEvents,
  SocketData
>;
