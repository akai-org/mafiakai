import type { CustomSocket } from "@/types/Socket";
import type { GameModel } from "@global/GameModel";
import { useCallback, useEffect, useState } from "react";
import { ApiContext, initialState } from "./GameContext";
import useSocket from "./useSocket";

export default function APIProvider({ children }: { children: React.ReactNode }) {
  // const [buffor, setBuffor] = useState<GameModel>(initialState.state); Maybe some day
  const [state, setState] = useState<GameModel>(initialState.state);
  const [actions, setActions] = useState(initialState.actions);

  useEffect(() => {
    if (state.error) console.log(`Error: %c ${state.error.text}`, "color: #FF63C1");
  }, [state.error]);

  const update = (key: keyof GameModel) => (value: GameModel[typeof key]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const updateTimer = update("timer");
  const updateLastKilled = update("lastKilled");
  const updateError = update("error");
  const updatePhase = update("phase");
  const updatePlayers = update("players");
  const updateYourId = update("yourId");

  const gameStateHandler = useCallback((s: CustomSocket) => {
    // Register listeners
    s.on("newTimer", updateTimer);
    s.on("newLastKilled", updateLastKilled);
    s.on("newError", updateError);
    s.on("newPhase", updatePhase);
    s.on("newPlayers", updatePlayers);
    s.on("sendPlayerId", updateYourId);

    setActions({
      setPersona: (persona) => s.emit("updatePersona", persona),
      setPlayerName: (name) => s.emit("setPlayerName", name),
      setSeat: (seat) => s.emit("setSeat", seat),
      setReady: (ready) => s.emit("setReady", ready),
      vote: (vote) => s.emit("vote", vote),
    });

    // DEV ONLY <user>;<persona>;<seat>;<isReady>
    const str = sessionStorage.getItem("test");
    if (str !== null) {
      const [name, personaName, seat, isReady] = str.split(";");
      if (name) s.emit("setPlayerName", name);
      if (personaName) s.emit("updatePersona", { name: personaName });
      if (seat) s.emit("setSeat", Number(seat));
      if (isReady) s.emit("setReady", isReady === "true");
    }

    return () => {
      s.off("newTimer", updateTimer);
      s.off("newLastKilled", updateLastKilled);
      s.off("newError", updateError);
      s.off("newPhase", updatePhase);
      s.off("newPlayers", updatePlayers);
      s.off("sendPlayerId", updateYourId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
