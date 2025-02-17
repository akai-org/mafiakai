import useSwipe from "@/hooks/useSwipe";
import { useCallback, useState } from "react";
import Character from "./Character";
import Seat from "./Seats";
import useKeyDown from "@/hooks/useKeyDown";

enum Panels {
  Character = "Character",
  Seat = "Seat",
}

const panelsValues = Object.values(Panels);
const panelLenght = panelsValues.length;

function* names(): IterableIterator<string> {
  yield "Franek";
  yield "Ula";
  yield "Krzysiek";
  yield "Rafał";
  yield "Bartek";
  yield "Iza";
  yield "Jacek";
  yield "Darek";
  yield "Kuba";
  yield "Kasia";
  yield "Asia";
  yield "Ola";
}

const namesGen = names();

function Lobby() {
  // Handle panels
  const [panelId, setPanel] = useState<number>(1);
  const prevPanel = useCallback(() => setPanel((panelId - 1 + panelLenght) % panelLenght), [panelId]);
  const nextPanel = useCallback(() => setPanel((panelId + 1 + panelLenght) % panelLenght), [panelId]);

  const swipeRef = useSwipe({ onSwipeLeft: prevPanel, onSwipeRight: nextPanel });
  useKeyDown({ ArrowLeft: prevPanel, ArrowRight: nextPanel });

  // TEST PURPOSES for Seats component
  const [players, setPlayers] = useState<string[]>(["Paweł", "Maciek", "Kuba", "Asia", "Ola"]);

  const handleSetPosition = (i: number) => {
    const val = namesGen.next().value;
    if (!val) return;
    setPlayers((players) => {
      const newPlayers = [...players];
      newPlayers.splice(i, 0, val);
      return newPlayers;
    });
  };

  return (
    <div className="flex h-full max-w-md select-none flex-col border-2">
      <div className="flex justify-between p-4">
        <h1>MafiAKAI</h1>

        <div className="">Options</div>
      </div>

      <div className="flex border-b-2 border-neutral-800">
        {panelsValues.map((panelName, i) => (
          <button
            className={`w-full rounded-t-2xl py-1 transition-colors ${i === panelId ? "bg-neutral-800 text-white" : ""}`}
            onClick={() => setPanel(i)}
            key={panelName}
          >
            {panelName}
          </button>
        ))}
      </div>

      <div className="h-full" ref={swipeRef}>
        {panelsValues[panelId] === Panels.Seat && (
          <Seat players={players} selectSeat={handleSetPosition} yourSeat={null} />
        )}
        {panelsValues[panelId] === Panels.Character && <Character />}
      </div>
    </div>
  );
}

export default Lobby;
