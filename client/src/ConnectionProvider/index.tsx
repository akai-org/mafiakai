import { useEffect } from "react";
import { useParams } from "react-router";
import { ConnContext, socket } from "./Context";

function ConnectionProvider(props: { children: React.ReactNode }) {
  // Get the code from the URL
  const { code } = useParams();

  // Create a socket connection
  useEffect(() => {
    if (socket.connected) return;

    socket.io.opts.query = { code };

    socket.on("connect", () => console.log("Connected to server"));
    socket.on("connect_error", (err) => console.error(err));
    socket.on("disconnect", () => console.log("Disconnected from server"));
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [code]);

  return (
    <ConnContext.Provider value={{ socket }}>
      {props.children}
    </ConnContext.Provider>
  );
}

export default ConnectionProvider;
