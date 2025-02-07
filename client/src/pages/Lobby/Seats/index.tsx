import { Button } from "@/components";
import useKeyDown from "@/hooks/useKeyDown";
import { useMemo, useState } from "react";

import { mod } from "@/utils/mod";
import ClockInput from "./ClockInput";
import FreeBubble from "./FreeBubble";
import Paragraph from "./Paragraph";
import PlayerBubble from "./PlayerBubble";

export type Seat = { id: number; name: string } | null;

function Seat(props: { selectSeat(i: number): void; players: string[]; yourSeat: number | null }) {
  // Seats array
  const seats = useMemo<Seat[]>(() => calcSeats(props.players, props.yourSeat), [props.players, props.yourSeat]);

  const [pointer, setPointer] = useState<number>(0);

  // Keyboard navigation
  useKeyDown({
    ArrowUp: () => setPointer((p) => mod(p - 1, props.players.length)),
    ArrowDown: () => setPointer((p) => mod(p + 1, props.players.length)),
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

interface PlayerSeat {
  id: number;
  name: string;
}

function calcSeats(players: string[], yourSeat: number | null): (PlayerSeat | null)[] {
  return new Array(players.length * 2 - (yourSeat !== null ? 2 : 0)).fill(null).map((_v, i) => {
    const isFree = i % 2 === 0;
    const playerId = Math.floor((i + 1) / 2);
    if (yourSeat === null) return isFree ? null : { id: playerId - 1, name: players[playerId - 1] };

    const edge = yourSeat * 2;
    if (i == edge + 0) return { id: playerId, name: players[playerId] };
    if (i == edge + 1) return { id: playerId, name: players[playerId] };

    if (isFree) return null;
    else {
      const edgedId = playerId - 1 + (i >= edge ? 1 : 0);
      return { id: edgedId, name: players[edgedId] };
    }
  });
}
