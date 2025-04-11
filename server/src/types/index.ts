// prettier-ignore
import {
  Client2ServerEvents,
  InterServerEvents,
  Server2ClientEvents,
  SocketData,
} from "@global/Sockets";
import { Server, Socket } from "socket.io";

// prettier-ignore
export type MAServer = Server<
  Client2ServerEvents,
  Server2ClientEvents,
  InterServerEvents,
  SocketData
>;

// prettier-ignore
export type MASocket = Socket<
  Client2ServerEvents,
  Server2ClientEvents,
  InterServerEvents,
  SocketData
>;
