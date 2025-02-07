import { mod } from "@/utils/mod";
import type { Seat } from ".";

export default function Paragraph(props: { seats: Seat[]; arrow: number; yourSeat: number | null }) {
  const playerLeft = props.seats[mod(props.arrow + 1, props.seats.length)];
  const playerCent = props.seats[props.arrow];
  const playerRight = props.seats[mod(props.arrow - 1, props.seats.length)];

  return (
    <p className="h-8 text-center">
      {(() => {
        if (playerCent && props.yourSeat === props.arrow) return `You are sitting here`;

        if (playerCent) return `Here sits ${playerCent.name}`;

        if (playerLeft && playerRight && playerLeft.id === playerRight.id)
          return `Free seat opposite ${playerLeft.name}`;

        return `Free seat, on the left sits ${playerLeft?.name} and on the right sits ${playerRight?.name}`;
      })()}
    </p>
  );
}
