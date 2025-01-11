import { useContext, useEffect, useState } from "react";
import { ConnContext } from "@/features/connection";
import { Phases } from "@global/Game";
import Lobby from "@/pages/Lobby";

function Game() {
  const { socket } = useContext(ConnContext);

  const [phase, setPhase] = useState(Phases.GAME_END);

  useEffect(() => {
    socket.on("phase_updated", ({ err, phase }) => {
      if (err) {
        console.error("Error in phase_updated occured: " + err);
        return;
      }
      setPhase(phase);
    });
  }, [socket]);

  // Render certain components based on the game phase

  switch (phase) {
    case Phases.LOBBY:
      return <Lobby />;

    default:
      return <div>Placeholder for phase {phase}</div>;
  }
}

export default Game;
