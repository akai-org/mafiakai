import express from "express";
import http from "http";
import { Server } from "socket.io";
import webRoutes from "./src/webRoutes";
import { MAServer } from "./types/Sockets";
import config from "./config";
import socketRoutes from "./src/socketRoutes";
import socketAuth from "./src/socketAuth";

const app = express(); // Create an Express application

// Create servers
const httpServer = http.createServer(app); // Create an HTTP server
const socketsServer: MAServer = new Server(); // Create a WebSocket server

// Configure servers
socketsServer.use(socketAuth).use(socketRoutes); // Configure the WebSocket server
app.use("/", webRoutes); // Configure the HTTP server

// Start servers
socketsServer.listen(httpServer); // Start the WebSocket server
app.listen(config.PORT, () =>
  console.log(
    `Server is running on${"\x1b[34m"} http://${config.HOST}:${
      config.PORT
    }${"\x1b[0m"}`
  )
); // Start the HTTP server
