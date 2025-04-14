import { useContext } from "react";
import { Phases } from "@global/Phases";
import { ApiContext } from "@/features/api/GameContext";
import type { Persona } from "@global/Persona";
import type { PlayerModel } from "@global/PlayerModel";

export function useYourself() {
  const { state } = useContext(ApiContext);

  const yourPlayer =
    state.players.find((player) => player.id === state.yourId) ??
    ({
      id: "",
      name: null,
      persona: {
        name: "",
        profession: "",
        description: "",
        preferences: "",
      } as Persona,
      role: null,
      isReady: false,
      alive: false,
      guarded: false,
      online: false,
      seat: null,
    } as PlayerModel);

  if (!yourPlayer && state.phase !== Phases.LOBBY) throw new Error("You are not in the game");

  return yourPlayer;
}
