import express from "express";
import http from "http";
import { Server } from "socket.io";

import { MAServer } from "@local/Sockets";
import config from "./config";

import webRoutes from "@/webRoutes";
import socketRoutes from "@/socketRoutes";
import socketAuth from "@/socketAuth";
import { Phases } from "@global/Game";
import { manager } from "@/RoomManager";
import { Roles } from "@global/Roles";

const app = express(); // Create an Express application

// Create servers
const httpServer = http.createServer(app); // Create an HTTP server
const socketsServer: MAServer = new Server(httpServer); // Create a WebSocket server

socketsServer.on('connection',(socket)=>{
  console.log(socket.id);

  socket.on("joinRoom", (code) => {
    const room = manager.getRoom(code);
    if (room === undefined){
      socket.emit('info',`Room ${code} does not exist`);
      // socket.disconnect();
      return;
    }
    
    socket.join(code);
    const playerid = manager.generatePlayerId();
    room.addPlayer({name: playerid, id: playerid, role: Roles.REGULAR_CITIZEN});
    socket.emit("info",`Added ${playerid} to room ${code}`);
    socket.join(code+'-'+Phases.LOBBY);
  });
})

// Configure servers
// Socket.IO middleware doesn't work yet
// socketsServer.use(socketAuth).use(socketRoutes); // Configure the WebSocket server 
app.use("/", webRoutes); // Configure the HTTP server

// Start servers
httpServer.listen(config.PORT); // See https://socket.io/docs/v4/server-initialization/#with-express
console.log(`Server is running on${"\x1b[34m"} http://${config.HOST}:${config.PORT}${"\x1b[0m"}`);
