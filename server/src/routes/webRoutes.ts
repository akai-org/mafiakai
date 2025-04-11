import { manager } from "@/constants/manager";
import express from "express";

const webRouter = express.Router();

webRouter.get("/", (req, res) => {
  res.send("Hello World");
});

webRouter.get("/create", (req, res) => {
  const room = manager.create();
  res.json({ code: room.code });
});

webRouter.get("/room/:code", (req, res) => {
  const room = manager.getRoom(req.params.code);

  if (room == undefined) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json({
    roomCode: room.code,
    playersInRoom: room.game._players.all.length,
    players: room.game._players.all.map((p) => p.name),
  });
});

export default webRouter;
