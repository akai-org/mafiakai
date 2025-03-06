import express from "express";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import { MAServer } from "@/types";
import { config } from "@/constants";
import { socketAuth } from "@/middlewares";
import { socketRoutes, webRouter } from "@/routes";

const app = express(); // Create an Express application

// if (process.env.NODE_ENV != "production" ){
//   app.use((req, _, next) => {
//     console.log(req);
//     next();
//   });
// }

// Create servers
const httpServer = http.createServer(app); // Create an HTTP server

const development_socketio_proxies = process.env.NODE_ENV != "production" ? ["https://admin.socket.io", "https://firecamp.dev"] : []

// Create a WebSocket server
const socketsServer: MAServer = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173",...development_socketio_proxies],
    // methods: ["GET", "POST"],
    credentials: true,
  },
});

if (process.env.NODE_ENV != "production" ){
  instrument(socketsServer, {
    auth: false,
    mode: "development",
  });
  }

// Configure servers
socketsServer.use(socketAuth).on("connection", socketRoutes); // Configure the WebSocket server
app.use("/", webRouter); // Configure the HTTP server

// Start servers
httpServer.listen(config.PORT, () => {
  console.log(`Server is running on${"\x1b[34m"} http://${config.HOST}:${config.PORT}${"\x1b[0m"}`);
});
// See https://socket.io/docs/v4/server-initialization/#with-express
