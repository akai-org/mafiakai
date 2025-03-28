import { useState } from "react";
import RadialSelection from "@/features/radial-selection";
import { useNavigate } from "react-router";
import { Button } from "@/components";

function Debate() {
  const [players] = useState<string[]>(["Paweł", "Maciek", "Kuba", "Asia", "Ola"]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlayerSelection = (seatId: number) => {
    const playerName = players[seatId];
    setSelectedPlayer(playerName);
    console.log("Selected player:", playerName);
  };

  const handleNavigateToProfile = () => {
    if (selectedPlayer) {
      navigate(`/profile/${selectedPlayer}`);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow bg-gray-300">
        <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
          <div className="min-h-96 min-w-96 rounded-lg border-2 border-black bg-white p-8 text-center">
            <div>
              <RadialSelection selectSeat={handlePlayerSelection} players={players} yourSeat={null} />
            </div>

            {selectedPlayer && (
              <div className="mt-2 text-center">
                <p className="text-md mb-2 font-semibold text-black">Selected Player: {selectedPlayer}</p>
                <Button size="button-sm" onClick={handleNavigateToProfile}>
                  View Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debate;
