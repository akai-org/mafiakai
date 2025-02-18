import useCircleCapture from "@/hooks/useCircleCapture";

/**
 * @deprecated
 * Input shaped like a clock, with a pointer that can be moved around the clock face.
 * May be used in the future.
 */

export default function Clock(props: { arrowPointer: number; arrowLength: number; onClick?: () => void }) {
  const [circleRef, slide] = useCircleCapture(props.arrowLength, 180 / props.arrowLength);

  console.log(slide);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Clock face */}
      <div ref={circleRef} onClick={props.onClick} className="aspect-square w-[90%] rounded-full bg-neutral-300" />

      {/* Arrow */}
      <div
        className="pointer-events-none absolute z-0 h-[2px] w-[38.5%] origin-left bg-neutral-600 transition-all"
        style={{
          transform: `translateX(50%) rotate(${props.arrowPointer / props.arrowLength}turn)`,
        }}
      />

      {/* Dot */}
      <div className="absolute aspect-square h-3 rounded-full bg-neutral-800" />
    </div>
  );
}
