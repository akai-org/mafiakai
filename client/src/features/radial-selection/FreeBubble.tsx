export default function FreeBubble(props: { isSelected: boolean }) {
  return (
    <div
      className="m-2 aspect-square rounded-full border-2 border-neutral-400 transition-transform"
      style={{
        transform: props.isSelected ? "scale(1.5)" : "",
      }}
    />
  );
}
