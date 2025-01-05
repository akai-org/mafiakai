import { useEffect } from "react";
import { useParams } from "react-router";
import { ConnContext } from "./ConnContext";
import { socket } from "@/constants";

function ConnectionProvider(props: { children: React.ReactNode }) {
  // Get the code from the URL
  const { code } = useParams();

  // Create a socket connection
  useEffect(() => {
    if (socket.connected || code === undefined) return;

    socket.io.opts.query = { code, name: "Player", id: "0" };

    socket.on("connect", () => console.log("Connected to server"));
    socket.on("connect_error", (err) => console.error(err));
    socket.on("disconnect", () => console.log("Disconnected from server"));
    socket.on("info", (data) => console.info(data));
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [code]);

  return <ConnContext.Provider value={{ socket }}>{props.children}</ConnContext.Provider>;
}

export default ConnectionProvider;
