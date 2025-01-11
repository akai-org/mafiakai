import { SID_KEY_NAME, socket } from "@/constants";
import { useEffect } from "react";
import { connect, disconnect } from "./utils";

function useConnection(code: string | undefined) {
  useEffect(() => {
    if (code === undefined) return;

    socket.on("connect", () => console.log("Connected to server"));
    socket.on("connect_error", (err) => console.error(err));
    socket.on("disconnect", () => console.log("Disconnected from server"));

    socket.on("conn_info_data", ({ playerId }) => {
      localStorage.setItem(SID_KEY_NAME, playerId);
    });

    connect(code);

    return () => {
      disconnect();
      //TODO: remove registered listeners
    };
  }, [code]);
}

export default useConnection;
