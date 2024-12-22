import express from "express";
import { manager } from "./RoomManager";

const webRouter = express.Router();

webRouter.get("/", (req, res) => {
  res.send("Hello World");
});

webRouter.get("/", (req, res) => {
  const roomCode = manager.create();
  res.json({ code: roomCode });
});

export default webRouter;
