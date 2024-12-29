import { useContext, useEffect, useState } from "react";
import { ConnContext } from "@/ConnectionProvider/Context";
import { Phases } from "@global/Game";

function Game() {
  const { socket } = useContext(ConnContext);

  const [phase, setPhase] = useState(Phases.GAME_END);

  useEffect(() => {
    socket.on("phaseChange", (data: Phases) => setPhase(data));
  }, [socket]);

  // Render certain components based on the game phase
  return (
    <div>
      <h1>Room is in phase {phase}</h1>
    </div>
  );
}

export default Game;
