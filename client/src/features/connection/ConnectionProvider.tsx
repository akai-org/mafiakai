import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { ConnContext } from "./ConnContext";
import { socket } from "@/constants";
import { connect, disconnect } from "./utils";

function ConnectionProvider(props: { children: React.ReactNode }) {
  // Get the code from the URL
  const { code } = useParams();

  // Create a socket connection
  useEffect(() => {
    if (code === undefined) return;

    socket.on("connect", () => console.log("Connected to server"));
    socket.on("connect_error", (err) => console.error(err));
    socket.on("disconnect", () => console.log("Disconnected from server"));
    socket.on("info", (data) => console.info(data));

    connect({ code, id: "0", name: "Player" });

    return () => {
      disconnect();
    };
  }, [code]);

  const contextValue = useMemo(() => ({ socket, connect, disconnect }), []);

  return <ConnContext.Provider value={contextValue}>{props.children}</ConnContext.Provider>;
}

export default ConnectionProvider;
