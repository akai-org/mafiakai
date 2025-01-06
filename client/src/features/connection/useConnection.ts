import { socket } from "@/constants";
import { useEffect } from "react";
import { connect, disconnect } from "./utils";

function useConnection(code: string | undefined) {
  useEffect(() => {
    if (code === undefined) return;

    socket.on("connect", () => console.log("Connected to server"));
    socket.on("connect_error", (err) => console.error(err));
    socket.on("disconnect", () => console.log("Disconnected from server"));
    socket.on("info", (data) => console.info(data));

    connect({ code, id: "0", name: "Player" });

    return () => {
      disconnect();
      //TODO: remove registered listeners
    };
  }, [code]);
}

export default useConnection;
