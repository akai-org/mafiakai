import express from "express";
import http from "http";
import { Server } from "socket.io";

import { MAServer } from "@/types";
import { config } from "@/constants";
import { socketAuth } from "@/middlewares";
import { socketRoutes, webRouter } from "@/routes";

const app = express(); // Create an Express application

// Create servers
const httpServer = http.createServer(app); // Create an HTTP server

// Create a WebSocket server
const socketsServer: MAServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Configure servers
socketsServer.use(socketAuth).on("connection", socketRoutes); // Configure the WebSocket server
app.use("/", webRouter); // Configure the HTTP server

// Start servers
httpServer.listen(config.PORT, () => {
  console.log(`Server is running on${"\x1b[34m"} http://${config.HOST}:${config.PORT}${"\x1b[0m"}`);
});
// See https://socket.io/docs/v4/server-initialization/#with-express
