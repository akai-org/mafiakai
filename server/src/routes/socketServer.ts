import { MAServer } from "@/types";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { httpServer } from "./httpServer";

const development_socketio_proxies =
  process.env.NODE_ENV != "production" ? ["https://admin.socket.io", "https://firecamp.dev"] : [];

// Create a WebSocket server
export const socketsServer: MAServer = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", ...development_socketio_proxies],
    // methods: ["GET", "POST"],
    credentials: true,
  },
});

if (process.env.NODE_ENV != "production") {
  instrument(socketsServer, {
    auth: false,
    mode: "development",
  });
}
