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
const socketsServer: MAServer = new Server(httpServer,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
}); // Create a WebSocket server

socketsServer.on('connection',(socket)=>{
  console.log(socket.id);

  socket.on("createRoom",(callback) => {
    const code = manager.create();
    callback(code);
    socket.emit("rooms",Array.from(manager.rooms.keys()));
  });

  socket.on("joinRoom", (code, position, callback) => {
    console.log(`${socket.id} joinRoom`);
    const room = manager.getRoom(code);
    if (room === undefined){
      // socket.emit('info',`Room ${code} does not exist`);
      callback(`ERROR: Room ${code} does not exist`)
      return;
    }
    
    if (!([Phases.LOBBY, Phases.POSITION_SELECTION, Phases.CHARACTER_SELECTION, Phases.ROLE_ASSIGNMENT, Phases.WELCOME].includes(room.phase))){
      // socket.emit('info',`Room ${code} does not accept new players currently`);
      callback(`ERROR: Room ${code} does not accept new players currently`);
      return;
    }

    socket.join(code);
    const playerid = manager.generatePlayerId();
    room.addPlayerAt(position,{name: `player-${playerid}`, id: playerid, role: Roles.REGULAR_CITIZEN});
    // socket.emit("info",`Added player id=${playerid} to room ${code}`);
    socket.join(code+'-'+Phases.LOBBY);
    callback(`OK: Added player id=${playerid} to room ${code}`);
  });
})

// Configure servers
// Socket.IO middleware doesn't work yet
// socketsServer.use(socketAuth).use(socketRoutes); // Configure the WebSocket server 
app.use("/", webRoutes); // Configure the HTTP server

// Start servers
httpServer.listen(config.PORT); // See https://socket.io/docs/v4/server-initialization/#with-express
console.log(`Server is running on${"\x1b[34m"} http://${config.HOST}:${config.PORT}${"\x1b[0m"}`);
