import type { CustomSocket } from "@/types/Socket";
import { io } from "socket.io-client";

export const socket: CustomSocket = io("ws://localhost:5000", {
  autoConnect: false,
});
