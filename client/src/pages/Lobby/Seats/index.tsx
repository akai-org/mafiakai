import { Button } from "@/components";
import { useKeyDown } from "@/hooks";
import { useMemo, useState } from "react";

import { ClockInput, FreeBubble, PlayerBubble } from "@/features/radial-selection";
import Paragraph from "./Paragraph";
import { calcSeats, mod } from "@/utils";

export type Seat = { id: number; name: string } | null;

function Seat(props: { selectSeat(i: number): void; players: string[]; yourSeat: number | null }) {
  // Seats array
  const seats = useMemo<Seat[]>(() => calcSeats(props.players, props.yourSeat), [props.players, props.yourSeat]);

  const [pointer, setPointer] = useState<number>(0);

  // Keyboard navigation
  useKeyDown({
    ArrowUp: () => setPointer((p) => mod(p - 1, seats.length)),
    ArrowDown: () => setPointer((p) => mod(p + 1, seats.length)),
  });

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <Paragraph arrow={pointer} seats={seats} yourSeat={props.yourSeat} />

      <div className="relative flex h-1/2 w-full items-center justify-center">
        <ClockInput
          value={pointer}
          onChange={setPointer}
          labels={seats}
          onSelect={(seat) => seat && props.selectSeat(seat.id)}
          bubbleElement={(i, player, isSelected) =>
            player === null ? (
              <FreeBubble key={i} isSelected={isSelected} />
            ) : (
              <PlayerBubble
                key={i}
                isSelected={isSelected}
                isYourSeat={player.id === props.yourSeat}
                name={player.name}
              />
            )
          }
        />
      </div>

      <Button size="button-lg">Reserve your place</Button>
    </div>
  );
}

export default Seat;
