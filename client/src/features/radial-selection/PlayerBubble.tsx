export default function PlayerBubble(props: { name: string; isYourSeat: boolean; isSelected: boolean }) {
  return (
    <div
      key={props.name}
      className="flex aspect-square w-full items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-300 p-1 transition-all"
      style={{
        backgroundColor: props.isSelected || props.isYourSeat ? "white" : "",
        // transform: props.isSelected ? "scale(1.5)" : "",
      }}
    >
      {props.name[0]}
    </div>
  );
}
