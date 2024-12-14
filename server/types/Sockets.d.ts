import {
  Client2ServerEvents,
  InterServerEvents,
  Server2ClientEvents,
  SocketData,
} from "../../types/Sockets";
import { Server, Socket } from "socket.io";

type MAServer = Server<
  Client2ServerEvents,
  Server2ClientEvents,
  InterServerEvents,
  SocketData
>;

type MASocket = Socket<
  Client2ServerEvents,
  Server2ClientEvents,
  InterServerEvents,
  SocketData
>;
