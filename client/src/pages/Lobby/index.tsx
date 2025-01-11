import useSwipe from "@/hooks/useSwipe";
import { useCallback, useState } from "react";
import Character from "./Character";
import Seat from "./Seat";
import Waiting from "./Waiting";
import useKeyDown from "@/hooks/useKeyDown";

enum Panels {
  Character = "Character",
  Seat = "Seat",
  Waiting = "Waiting",
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
}

const namesGen = names();

function Lobby() {
  const [panelId, setPanel] = useState<number>(0);

  const nextPanel = useCallback(() => setPanel((panelId + 1 + panelLenght) % panelLenght), [panelId]);
  const prevPanel = useCallback(() => setPanel((panelId - 1 + panelLenght) % panelLenght), [panelId]);

  const swipeRef = useSwipe({ onSwipeLeft: nextPanel, onSwipeRight: prevPanel }, 50);

  useKeyDown({
    ArrowLeft: prevPanel,
    ArrowRight: nextPanel,
  });

  const [players, setPlayers] = useState<string[]>(["Paweł", "Maciek"]);

  // TEST PURPOSES
  const handleSetPosition = (i: number) => {
    console.log(i);

    const val = namesGen.next().value;
    if (!val) return;

    setPlayers((players) => {
      const newPlayers = [...players];
      newPlayers.splice(i, 0, val);
      return newPlayers;
    });
  };

  return (
    <div className="flex h-full max-w-md flex-col border-2">
      <div className="flex justify-between p-4">
        <h1>MafiAKAI</h1>

        <div className="">Options</div>
      </div>

      <div className="flex border-b-2 border-neutral-800">
        {Object.values(Panels).map((panelName, i) => (
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
        {panelsValues[panelId] === Panels.Seat ? (
          <Seat players={players} selectSeat={handleSetPosition} yourSeat={null} />
        ) : (
          <></>
        )}
        {panelsValues[panelId] === Panels.Character ? <Character /> : <></>}
        {panelsValues[panelId] === Panels.Waiting ? <Waiting /> : <></>}
      </div>
    </div>
  );
}

export default Lobby;
