import { config } from "@/constants";
import { socketAuth } from "@/middlewares";
import { socketRoutes, socketsServer, webRouter, httpServer } from "@/routes";
import { app } from "./app";

// if (process.env.NODE_ENV != "production" ){
//   app.use((req, _, next) => {
//     console.log(req);
//     next();
//   });
// }

// Configure servers
socketsServer.use(socketAuth).on("connection", socketRoutes); // Configure the WebSocket server
app.use("/", webRouter); // Configure the HTTP server

// Start servers
httpServer.listen(config.PORT, () => {
  console.log(`Server is running on${"\x1b[34m"} http://${config.HOST}:${config.PORT}${"\x1b[0m"}`);
});
// See https://socket.io/docs/v4/server-initialization/#with-express
