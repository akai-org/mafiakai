import { Button } from "@/components";
import useKeyDown from "@/hooks/useKeyDown";
import { useCallback, useMemo, useState } from "react";

import { mod } from "@/utils/mod";
import ClockInput from "./ClockInput";
import FreeBubble from "./FreeBubble";
import Paragraph from "./Paragraph";
import PlayerBubble from "./PlayerBubble";

interface PlayerSeat {
  id: number;
  name: string;
}

function Seat(props: { selectSeat(i: number): void; players: string[]; yourSeat: number | null }) {
  // Circle of seats
  const seats = useMemo<(PlayerSeat | null)[]>(
    () =>
      new Array(props.players.length * 2 - (props.yourSeat !== null ? 2 : 0)).fill(null).map((_v, i) => {
        const isFree = i % 2 === 0;
        const playerId = Math.floor((i + 1) / 2);
        if (props.yourSeat === null) return isFree ? null : { id: playerId - 1, name: props.players[playerId - 1] };

        const edge = props.yourSeat * 2;
        if (i == edge + 0) return { id: playerId, name: props.players[playerId] };
        if (i == edge + 1) return { id: playerId, name: props.players[playerId] };

        if (isFree) return null;
        else {
          const edgedId = playerId - 1 + (i >= edge ? 1 : 0);
          return { id: edgedId, name: props.players[edgedId] };
        }
      }),
    [props.players, props.yourSeat]
  );

  const [pointer, setPointer] = useState<number>(0);

  const handleSelectSeat = useCallback(() => {
    const playerNext = seats[pointer + 1];

    if (playerNext) props.selectSeat(playerNext.id);
  }, [props, pointer, seats]);

  // Keyboard navigation
  useKeyDown({
    ArrowUp: () => setPointer((p) => mod(p - 1, seats.length)),
    ArrowDown: () => setPointer((p) => mod(p + 1, seats.length)),
  });

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <Paragraph arrow={pointer} seats={seats} />

      <div className="relative flex h-1/2 w-full items-center justify-center">
        <ClockInput pointer={pointer} onChange={setPointer} length={seats.length} onClick={handleSelectSeat}>
          {seats.map((player, i) => {
            const isSelected = i === pointer;
            const slctYrSeat = player !== null && props.yourSeat === player.id;

            return player === null ? (
              <FreeBubble key={i} isSelected={isSelected} />
            ) : (
              <PlayerBubble key={i} isSelected={isSelected} isYourSeat={slctYrSeat} name={player.name} />
            );
          })}
        </ClockInput>
      </div>

      <Button size="button-lg">Reserve your place</Button>
    </div>
  );
}

export default Seat;
