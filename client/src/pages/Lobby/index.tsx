import useKeyDown from "@/hooks/useKeyDown";
import useSwipe from "@/hooks/useSwipe";
import { useCallback, useState } from "react";
import Character from "./Character";
import ModalPlayerName from "./ModalPlayerName";
import Seat from "./Seats";
import Waiting from "./Waiting";

enum Panels {
  Character = "Character",
  Seat = "Seat",
  Waiting = "Waiting",
}

const panelsValues = Object.values(Panels);
const panelLenght = panelsValues.length;

function Lobby() {
  // Handle panels
  const [panelId, setPanel] = useState<number>(1);
  const prevPanel = useCallback(() => setPanel((panelId - 1 + panelLenght) % panelLenght), [panelId]);
  const nextPanel = useCallback(() => setPanel((panelId + 1 + panelLenght) % panelLenght), [panelId]);

  const swipeRef = useSwipe({ onSwipeLeft: prevPanel, onSwipeRight: nextPanel });
  useKeyDown({ ArrowLeft: prevPanel, ArrowRight: nextPanel });

  return (
    <>
      <ModalPlayerName />

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
          {panelsValues[panelId] === Panels.Seat && <Seat />}
          {panelsValues[panelId] === Panels.Character ? <Character /> : <></>}
          {panelsValues[panelId] === Panels.Waiting ? <Waiting /> : <></>}
        </div>
      </div>
    </>
  );
}

export default Lobby;
