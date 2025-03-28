import { useState } from "react";
import ClockInput from "./ClockInput";
import type { Seat } from "@/pages/Lobby/Seats";
import PlayerBubble from "./PlayerBubble";
import { useKeyDown } from "@/hooks";
import { mod } from "@/utils";

type RadialSelectionType = {
  selectSeat: (seatId: number) => void;
  players: string[];
  yourSeat: number | null;
};

function RadialSelection({ players, selectSeat, yourSeat }: RadialSelectionType) {
  const [pointer, setPointer] = useState(0);
  const seats = players.map((playerName, i): Seat => ({ id: i, name: playerName }));

  useKeyDown({
    ArrowUp: () => setPointer((p) => mod(p - 1, seats.length)),
    ArrowDown: () => setPointer((p) => mod(p + 1, seats.length)),
  });

  return (
    <div className="relative flex h-1/2 w-full items-center justify-center">
      <ClockInput
        value={pointer}
        onChange={setPointer}
        labels={seats}
        onSelect={(seat) => seat && selectSeat(seat.id)}
        bubbleElement={(i, player, isSelected) => (
          <PlayerBubble
            key={i}
            isSelected={isSelected}
            isYourSeat={player?.id === yourSeat}
            name={player?.name ?? "?"}
          />
        )}
      />
    </div>
  );
}

export default RadialSelection;
