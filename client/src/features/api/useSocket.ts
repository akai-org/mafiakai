import type { CustomSocket } from "@/types/Socket";
import { PLAYER_ID_KEY_NAME, ROOM_CODE_KEY_NAME } from "@global/Sockets";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";

const socket: CustomSocket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
});

function connect() {
  if (socket.connected) return;

  const playerId = sessionStorage.getItem(PLAYER_ID_KEY_NAME);
  if (playerId) socket.auth = { [PLAYER_ID_KEY_NAME]: playerId };

  socket.connect();
}

function disconnect() {
  socket.disconnect();
}

/**
 * This hook is used to manage the socket connection and its status
 */
type SocketStatus = "preparing" | "connected" | "reconnecting" | "error";
export default function useSocket(initializeSocketHandlers: (socket: CustomSocket) => () => void) {
  // Get the room code from the URL params
  const { code } = useParams<{ code: string }>();
  if (!code) throw new Error("Room code is not defined");

  useEffect(() => {
    socket.io.opts.query = { [ROOM_CODE_KEY_NAME]: code };
  }, [code]);

  // Set up data listeners
  useEffect(() => {
    const cleanup = initializeSocketHandlers(socket);

    return () => {
      cleanup();
    };
  }, [initializeSocketHandlers]);

  // Set up the socket connection listeners
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [status, setStatus] = useState<SocketStatus>("preparing");
  const isConnected = useMemo(() => status === "connected", [status]);

  const handleOnConnection = () => {
    setStatus("connected");
    setConnectionError(null);
  };

  const handleConnectionError = (err: Error) => {
    setConnectionError(err.message);
    setStatus("error");
  };

  const handlePlayerId = (playerId: string) => {
    sessionStorage.setItem(PLAYER_ID_KEY_NAME, playerId);
  };

  const handleOnDisconnect = useCallback((reason: string) => {
    switch (reason) {
      case "io server disconnect":
        // the disconnection was initiated by the server, you need to reconnect manually
        setStatus("error");
        break;
      case "io client disconnect":
        // the disconnection was initiated by the client, you can ignore it
        break;
      default:
        // else the socket will automatically try to reconnect
        setStatus("reconnecting");
        break;
    }
  }, []);

  useEffect(() => {
    socket.on("connect", handleOnConnection);
    socket.on("disconnect", handleOnDisconnect);
    socket.on("connect_error", handleConnectionError);
    socket.on("sendPlayerId", handlePlayerId);

    connect();

    return () => {
      socket.off("connect", handleOnConnection);
      socket.off("disconnect", handleOnDisconnect);
      socket.off("connect_error", handleConnectionError);
      socket.off("sendPlayerId", handlePlayerId);
    };
  }, [handleOnDisconnect]);

  return {
    socket,
    isConnected,
    connectionError,
    status,
    connect: connect,
    disconnect: disconnect,
  };
}
