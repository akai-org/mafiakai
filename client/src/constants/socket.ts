import type { CustomSocket } from "@/types/Socket";
import { io } from "socket.io-client";

export const socket: CustomSocket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
});
