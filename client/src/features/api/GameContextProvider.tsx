import type { GameModel } from "@global/GameModel";
import { useCallback, useState } from "react";
import { ApiContext, initialState } from "./GameContext";
import useSocket from "./useSocket";
import type { CustomSocket } from "@/types/Socket";

export default function APIProvider({ children }: { children: React.ReactNode }) {
  // const [buffor, setBuffor] = useState<GameModel>(initialState.state); Maybe some day
  const [state, setState] = useState<GameModel>(initialState.state);
  const [actions, setActions] = useState(initialState.actions);

  const updateTimer = (timer: GameModel["timer"]) => setState((prev) => ({ ...prev, timer }));
  const updateLastKilled = (lastKilled: GameModel["lastKilled"]) => setState((prev) => ({ ...prev, lastKilled }));
  const updateError = (error: GameModel["error"]) => setState((prev) => ({ ...prev, error }));
  const updatePhase = (phase: GameModel["phase"]) => setState((prev) => ({ ...prev, phase }));
  const updatePlayers = (players: GameModel["players"]) => setState((prev) => ({ ...prev, players }));
  const updateYourId = (you: GameModel["yourId"]) => setState((prev) => ({ ...prev, you }));

  const gameStateHandler = useCallback((s: CustomSocket) => {
    // Register listeners
    s.on("newTimer", updateTimer);
    s.on("newLastKilled", updateLastKilled);
    s.on("newError", updateError);
    s.on("newPhase", updatePhase);
    s.on("newPlayers", updatePlayers);
    s.on("sendPlayerId", updateYourId);

    setActions({
      setPlayerName: (name) => s.emit("setPlayerName", name),
      setSeat: (seat) => s.emit("setSeat", seat),
      setReady: (ready) => s.emit("setReady", ready),
      vote: (vote) => s.emit("vote", vote),
    });

    return () => {
      // Unregister listeners
      s.off("newTimer", updateTimer);
      s.off("newLastKilled", updateLastKilled);
      s.off("newError", updateError);
      s.off("newPhase", updatePhase);
      s.off("newPlayers", updatePlayers);
      s.off("sendPlayerId", updateYourId);

      setActions({
        setPlayerName: () => {},
        setSeat: () => {},
        setReady: () => {},
        vote: () => {},
      });
    };
  }, []);

  const connection = useSocket(gameStateHandler);

  return (
    <ApiContext.Provider
      value={{
        state: state,
        actions: actions,
        connection: connection,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
