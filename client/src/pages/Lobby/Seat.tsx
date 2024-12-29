import { Button } from "@/components";
import useKeyDown from "@/hooks/useKeyDown";
import { mod } from "@/utils/mod";
import { useCallback, useMemo, useState } from "react";

const calcArrowPosition = (p: number, i: number, l: number) => {
  // Fun fact: python modulo operator is not the same as JS modulo operator
  const f = Math.floor(p / l);
  const a = mod(p, l);

  if (Math.abs(a - i) > Math.floor(l / 2)) {
    return (f + Math.sign(a - i)) * l + i;
  } else {
    return f * l + i;
  }
};

function Seat({
  selectSeat,
  players,
  yourSeat = null,
}: {
  selectSeat(i: number): void;
  players: string[];
  yourSeat: number | null;
}) {
  // Circle of seats
  const seats = useMemo<({ id: number; name: string } | null)[]>(
    () =>
      new Array(players.length * 2 - (yourSeat !== null ? 2 : 0)).fill(null).map((_v, i) => {
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
      }),
    [players, yourSeat]
  );

  // Arrow position
  const [position, setPosition] = useState<number>(0);
  const handleArrow = useCallback((i: number) => setPosition((p) => calcArrowPosition(p, i, seats.length)), [seats]);
  const arrow = useMemo(() => mod(position, seats.length), [position, seats]);

  // paragraph
  const playerLeft = seats[mod(arrow + 1, seats.length)];
  const playerCent = seats[arrow];
  const playerRight = seats[mod(arrow - 1, seats.length)];

  // Keyboard navigation
  useKeyDown({
    ArrowUp: () => handleArrow(arrow - 1),
    ArrowDown: () => handleArrow(arrow + 1),
  });

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <p className="h-8 text-center">
        {(() => {
          if (playerCent) return `Here sits ${playerCent.name}`;

          if (playerLeft && playerLeft === playerRight) return `Free seat opposite ${playerLeft.name}`;

          return `Free seat, on the left sits ${playerLeft?.name} and on the right sits ${playerRight?.name}`;
        })()}
      </p>

      <div className="relative flex h-1/2 w-full items-center justify-center">
        <div className="aspect-square w-4/5 rounded-full bg-neutral-300" />

        {/* Seats */}
        {seats.map((player, i) => {
          const slctSeat = i === arrow;
          const slctYrSeat = player !== null && yourSeat === player.id;
          return player !== null ? (
            <div
              key={player.name}
              onMouseEnter={() => handleArrow(i)}
              className="absolute flex aspect-square w-12 items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-300 p-2 transition-all"
              style={{
                transform:
                  `rotate(${i / seats.length}turn) translateX(120px)` +
                  (slctSeat ? "scale(1.5) translateX(50%) " : "") +
                  `rotate(${-i / seats.length}turn)`,
                zIndex: 1 - (i % 2),
                backgroundColor: slctSeat || slctYrSeat ? "white" : "",
              }}
            >
              {player.name[0]}
            </div>
          ) : (
            <div
              key={i + "seat"}
              className="absolute flex aspect-square w-12 items-center justify-center"
              style={{
                transform: `rotate(${i / seats.length}turn) translateX(120px)`,
                zIndex: 1 - (i % 2),
              }}
              onMouseEnter={() => handleArrow(i)}
              onClick={() => selectSeat(seats[arrow + 1]?.id ?? 0)}
            >
              <div
                className="aspect-square h-8 w-8 rounded-full border-2 border-neutral-400 transition-transform"
                style={{
                  transform: slctSeat ? "scale(1.5) translateX(15px)" : "",
                }}
              />
            </div>
          );
        })}

        {/* Arrow */}
        <div
          className="absolute z-0 h-[2px] w-[calc(120px)] origin-left bg-neutral-600 transition-all"
          style={{
            transform: `translateX(50%) rotate(${position / seats.length}turn)`,
          }}
        />

        {/* Clock face */}
        <div className="absolute aspect-square h-2 rounded-full bg-neutral-800" />
      </div>

      <Button size="button-lg">Reserve your place</Button>
    </div>
  );
}

export default Seat;
