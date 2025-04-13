import { useContext } from "react";
import { Phases } from "@global/Phases";
import { ApiContext } from "@/features/api/GameContext";

export function useYourself() {
  const { state } = useContext(ApiContext);

  const yourPlayer = state.players.find((player) => player.id === state.yourId) ?? {
    id: null,
    name: null,
    persona: { name: null, description: null },
    seat: null,
    isReady: false,
  };

  if (!yourPlayer && state.phase !== Phases.LOBBY) throw new Error("You are not in the game");

  return yourPlayer;
}
