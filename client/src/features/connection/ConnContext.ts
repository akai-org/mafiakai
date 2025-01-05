import { createContext } from "react";
import type { ConnectionContext } from "@/types/Socket";
import { socket } from "@/constants";

export const ConnContext = createContext<ConnectionContext>({
  socket,
});
