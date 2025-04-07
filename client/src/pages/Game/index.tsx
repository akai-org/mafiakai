import { ApiContext } from "@/features/api/GameContext";
import Lobby from "@/pages/Lobby";
import { Phases } from "@global/Phases";
import { useContext } from "react";

function Game() {
  const { state, connection } = useContext(ApiContext);

  // Render certain components based on the game phase

  switch (state.phase) {
    case Phases.LOBBY:
      return <Lobby />;

    default:
      return (
        <div>
          Placeholder for phase {state.phase}
          <br />
          Connection status {connection.status}
          <br />
          Error {connection.connectionError}
        </div>
      );
  }
}

export default Game;
