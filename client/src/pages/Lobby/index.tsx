import useSwipe from "@/hooks/useSwipe";
import { useCallback, useState } from "react";
import Character from "./Character";
import Seat from "./Seat";
import useKeyDown from "@/hooks/useKeyDown";

enum Panels {
  Character = "Character",
  Seat = "Seat",
}

const panelsValues = Object.values(Panels);
const panelLenght = panelsValues.length;

function Lobby() {
  const [panelId, setPanel] = useState<number>(0);

  const nextPanel = useCallback(() => setPanel((panelId + 1 + panelLenght) % panelLenght), [panelId]);
  const prevPanel = useCallback(() => setPanel((panelId - 1 + panelLenght) % panelLenght), [panelId]);

  const swipeRef = useSwipe({ onSwipeLeft: nextPanel, onSwipeRight: prevPanel }, 50);

  useKeyDown({
    ArrowLeft: prevPanel,
    ArrowRight: nextPanel,
  });

  return (
    <div className="flex h-full max-w-md flex-col border-2">
      <div className="flex justify-between p-4">
        <h1>MafiAKAI</h1>

        <div className="">Options</div>
      </div>

      <div className="flex border-b-2 border-neutral-800">
        {Object.values(Panels).map((p, i) => (
          <button
            className={`w-full rounded-t-2xl py-1 transition-colors ${i === panelId ? "bg-neutral-800 text-white" : ""}`}
            key={p}
            onClick={() => setPanel(i)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="h-full" ref={swipeRef}>
        {panelsValues[panelId] === Panels.Seat ? (
          <Seat players={["Paweł", "Magda", "Ula", "Martyna", "Franek", "Darek"]} selectSeat={() => {}} />
        ) : (
          <></>
        )}
        {panelsValues[panelId] === Panels.Character ? <Character /> : <></>}
      </div>
    </div>
  );
}

export default Lobby;
