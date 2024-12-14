import express from "express";

const webRouter = express.Router();

webRouter.get("/", (req, res) => {
  res.send("Hello World");
});

export default webRouter;
