import { createContext } from "react";
import type { ConnectionContext } from "@/types/Socket";
import { socket } from "@/constants";
import { connect, disconnect } from "./utils";

export const ConnContext = createContext<ConnectionContext>({
  socket,
  connect,
  disconnect,
});
