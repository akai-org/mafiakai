import { MAServer } from "@/types";
import { Server } from "socket.io";
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

try {
  if (process.env.NODE_ENV != "production") {
    const admin_ui = require("@socket.io/admin-ui");
    admin_ui.instrument(socketsServer, {
      auth: false,
      mode: "development",
    });
  }
} catch (error) {
  console.log('Module @socket.io/admin-ui is not available');
}
