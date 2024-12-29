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

function Seat({ selectSeat, players }: { selectSeat(i: number): void; players: string[] }) {
  const [position, setPosition] = useState<number>(0);

  const handleArrow = useCallback(
    (i: number) => setPosition((p) => calcArrowPosition(p, i, players.length * 2)),
    [players]
  );

  const arrow = useMemo(() => mod(position, players.length * 2), [position, players.length]);

  // paragraph
  const playerId = useMemo(() => Math.floor(arrow / 2), [arrow]);
  const player1 = players[playerId];
  const player2 = players[(playerId + 1) % players.length];

  useKeyDown({
    ArrowUp: () => handleArrow(arrow - 1),
    ArrowDown: () => handleArrow(arrow + 1),
  });

  return (
    <div className="flex h-full flex-col justify-evenly p-4">
      <p className="h-8 text-center">
        {(() => {
          if (arrow % 2 == 0) return `Here sits ${player1}`;

          if (player1 === player2) return `Free seat opposite ${player1}`;

          return `Free seat, on the left sits ${player2} and on the right sits ${player1}`;
        })()}
      </p>

      <div className="relative flex h-1/2 w-full items-center justify-center">
        <div className="aspect-square w-4/5 rounded-full bg-neutral-300" />

        {/* Seats */}
        {players.map((playerName, i) => {
          const slctSeat = i === playerId && arrow % 2 === 1;
          const slctPlay = i === playerId && arrow % 2 === 0;
          return (
            <>
              <div
                key={playerName}
                onMouseEnter={() => handleArrow(i * 2)}
                className="absolute flex aspect-square w-12 items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-300 p-2 transition-all"
                style={{
                  transform:
                    `rotate(${i / players.length}turn) translateX(120px)` +
                    (slctPlay ? "scale(1.5) translateX(50%) " : "") +
                    `rotate(${-i / players.length}turn)`,
                  zIndex: 1 - (i % 2),
                  backgroundColor: slctPlay ? "white" : "",
                }}
              >
                {playerName[0]}
              </div>

              <div
                key={i + "seat"}
                className="absolute flex aspect-square w-12 items-center justify-center"
                style={{
                  transform: `rotate(${(i * 2 + 1) / (players.length * 2)}turn) translateX(120px)`,

                  zIndex: 1 - (i % 2),
                }}
                onMouseEnter={() => handleArrow(i * 2 + 1)}
              >
                <div
                  className="aspect-square h-8 w-8 rounded-full border-2 border-neutral-400 transition-transform"
                  style={{
                    transform: slctSeat ? "scale(1.5) translateX(15px)" : "",
                  }}
                />
              </div>
            </>
          );
        })}

        {/* Arrow */}
        <div
          className="absolute z-0 h-[2px] w-[calc(120px)] origin-left bg-neutral-600 transition-all"
          style={{
            transform: `translateX(50%) rotate(${position / (players.length * 2)}turn)`,
          }}
        />

        {/* Clock face */}
        <div className="absolute aspect-square h-2 rounded-full bg-neutral-800" />
      </div>

      <button>Reserve your place</button>
    </div>
  );
}

export default Seat;
