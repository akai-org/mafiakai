import { Button } from "@/components";
import useKeyDown from "@/hooks/useKeyDown";
import { useContext, useMemo, useState } from "react";

import { ApiContext } from "@/features/api/GameContext";
import { useYourself } from "@/hooks/useYourself";
import { mod } from "@/utils/mod";
import ClockInput from "./ClockInput";
import FreeBubble from "./FreeBubble";
import Paragraph from "./Paragraph";
import PlayerBubble from "./PlayerBubble";

export type Seat = { id: number; name: string } | null;

export default function Seat() {
  const { state, actions } = useContext(ApiContext);
  const self = useYourself();

  const players = useMemo(
    () =>
      state.players
        .filter((p) => p.seat !== null)
        .sort((a, b) => a.seat! - b.seat!)
        .map((p) => p.name ?? "Nieznany"),
    [state.players]
  );

  const seats = useMemo<Seat[]>(() => calcSeats2(players, self.seat), [players, self.seat]);

  const [pointer, setPointer] = useState<number>(0);

  useKeyDown({
    ArrowUp: () => setPointer((p) => mod(p - 1, seats.length)),
    ArrowDown: () => setPointer((p) => mod(p + 1, seats.length)),
  });

  const handleReserve = () => {
    const s = seats.at(mod(pointer + 1, seats.length));
    if (s) actions.setSeat(s.id);
  };
  const handleDrop = () => actions.setSeat(null);

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <Paragraph arrow={pointer} seats={seats} seated={self.seat !== null} />

      <div className="relative flex h-1/2 w-full items-center justify-center">
        <ClockInput
          value={pointer}
          onChange={setPointer}
          labels={seats}
          onSelect={handleReserve}
          bubbleElement={(i, player, isSelected) =>
            player === null ? (
              <FreeBubble key={i} isSelected={isSelected} />
            ) : (
              <PlayerBubble key={i} isSelected={isSelected} isYourSeat={player.id === self.seat} name={player.name} />
            )
          }
        />
      </div>

      {self.seat === null ? (
        <Button size="button-lg" onClick={handleReserve}>
          Reserve your place
        </Button>
      ) : (
        <Button size="button-lg" onClick={handleDrop}>
          Drop your seat
        </Button>
      )}
    </div>
  );
}

function calcSeats2(players: string[], seat: number | null): (Seat | null)[] {
  if (seat !== null && seat >= players.length) throw new Error("Seat index out of bounds");

  const shift = seat ?? 0;
  const seats = [];
  for (let i = shift; i < players.length + shift; i++) {
    const player = players[mod(i, players.length)];
    seats.push({ id: players.indexOf(player), name: player });
    seats.push(null);
  }

  if (seat === null) return seats;

  const left = mod(0 * 2 - 1, seats.length);
  const right = mod(0 * 2 + 1, seats.length);
  return seats.filter((_, i) => i !== left && i !== right);
}
