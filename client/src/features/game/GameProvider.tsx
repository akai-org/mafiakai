import { useState, useEffect, useCallback } from "react";
import { GameContext } from "./GameContext";
import { PLAYER_ID_KEY_NAME, socket } from "@/constants";
import type { GameModel } from "@global/GameModel";
import type { Persona } from "@global/Persona";
import type { PlayerModel } from "@global/PlayerModel";
import { Phases } from "@global/Phases";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [gameState, setgameState] = useState<GameModel | null>(null);
  const connect = useCallback((roomCode: string) => {
    if (socket.connected) return;

    const playerId = localStorage.getItem(PLAYER_ID_KEY_NAME);
    if (playerId) {
      socket.auth = { playerId };
    }

    socket.io.opts.query = { roomCode };
    socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    const playerId = localStorage.getItem(PLAYER_ID_KEY_NAME);
    if (playerId) {
      socket.auth = { playerId };
      socket.connect();
    }
  }, []);

  const setReady = useCallback((ready: boolean) => {
    socket.emit("set_ready");
  }, []);

  const vote = useCallback((targetId: string) => {
    socket.emit("vote", targetId);
  }, []);

  const setSeat = useCallback((seatNumber: number) => {
    socket.emit("set_position", seatNumber);
  }, []);

  const setPlayerName = useCallback((name: string) => {
    socket.emit("send_player_name", name);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      setConnectionError(err.message);
    };

    const onConnInfoData = ({ playerId }: { playerId: string }) => {
      localStorage.setItem(PLAYER_ID_KEY_NAME, playerId);
    };

    const onNewPhase = (phase: Phases) => {
      setgameState((prev) => (prev ? { ...prev, phase } : null));
    };

    const onNewTimer = (start_at: number, end_at: number) => {
      setgameState((prev) => (prev ? { ...prev, timer: { start_at, end_at } } : null));
    };

    const onNewLastKilled = (lastKilled: string | null) => {
      setgameState((prev) => (prev ? { ...prev, lastKilled } : null));
    };

    const onNewPlayers = (players: PlayerModel[]) => {
      setgameState((prev) => {
        if (!prev) {
          return {
            phase: Phases.LOBBY,
            timer: { start_at: 0, end_at: 0 },
            lastKilled: null,
            players,
            error: null,
          };
        }
        return { ...prev, players };
      });
    };

    const onNewError = (error: any) => {
      setgameState((prev) => (prev ? { ...prev, error } : null));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("conn_info_data", onConnInfoData);

    socket.on("newPhase", onNewPhase);
    socket.on("newTimer", onNewTimer);
    socket.on("newLastKilled", onNewLastKilled);
    socket.on("newPlayers", onNewPlayers);
    socket.on("newError", onNewError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("conn_info_data", onConnInfoData);

      socket.off("newPhase", onNewPhase);
      socket.off("newTimer", onNewTimer);
      socket.off("newLastKilled", onNewLastKilled);
      socket.off("newPlayers", onNewPlayers);
      socket.off("newError", onNewError);
    };
  }, []);

  const contextValue = {
    isConnected,
    connectionError,
    gameState,

    setReady,
    vote,
    setSeat,
    setPlayerName,

    connect,
    disconnect,
    reconnect,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
}

export default GameProvider;
