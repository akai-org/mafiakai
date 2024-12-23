import express from "express";
import { manager } from "./RoomManager";

const webRouter = express.Router();

webRouter.get("/", (req, res) => {
  res.send("Hello World");
});

webRouter.get("/create", (req, res) => {
  const roomCode = manager.create();
  res.json({ code: roomCode });
});

webRouter.get("/room/:code", (req, res) => {
  const room = manager.getRoom(req.params.code);

  if (room == undefined) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json({ roomCode: room.code, playersInRoom: room.players.size });
});

export default webRouter;
