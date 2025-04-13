/* eslint-disable react-hooks/exhaustive-deps */
// useEffect deps are fine, the linter is wrong

import useCircleCapture from "@/hooks/useCircleCapture";
import useKeyDown from "@/hooks/useKeyDown";
import { mod } from "@/utils/mod";
import { clsx } from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Input shaped like a clock, with a pointer that can be moved around the clock face.
 */
export default function ClockInput<V>(props: {
  labels: V[];
  onSelect?: () => void;
  bubbleElement: (i: number, seat: V | null, pointed: boolean) => JSX.Element;
  // Controll input from outside
  value?: number;
  onChange?: (pointer: number) => void;
}) {
  // Props arrow value
  const valueMod = useMemo(() => mod(props.value ?? 0, props.labels.length), [props.value, props.labels.length]);

  // Mouse arrow value
  const [circleRef, slideMod] = useCircleCapture(props.labels.length, -90 + 180 / props.labels.length);

  // Arrow position
  const [arrow, setArrow] = useState<number>(0);
  const handleArrow = useCallback(
    (n: number) => setArrow((p) => calcArrowPosition(p, n, props.labels.length)),
    [props.labels.length]
  );
  const arrowMod = useMemo(() => mod(arrow, props.labels.length), [arrow, props.labels.length]);

  useEffect(() => {
    if (props.labels.length === 0) return;
    handleArrow(slideMod);
    if (props.onChange) props.onChange(slideMod);
  }, [slideMod, props.labels.length]);

  useEffect(() => {
    if (props.labels.length === 0) return;
    handleArrow(props.value ?? 0);
    if (props.onChange) props.onChange(props.value ?? 0);
  }, [props.value, props.labels.length]);

  useKeyDown({
    Enter: props.onSelect,
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Bubbles */}
      {props.labels.map((seat, i) => {
        return (
          <div
            key={i + "bubble"}
            className={clsx(
              "pointer-events-none absolute aspect-square transition-transform",
              props.labels.length < 24 ? "w-[12%]" : "w-[10%]"
            )}
            style={{
              transform: ` rotate(${0.25 + i / props.labels.length}turn) ${props.labels.length < 24 ? "translate(310%)" : "translate(390%)"} ${arrowMod === i ? "translateX(50%)" : ""} rotate(${-0.25 - i / props.labels.length}turn)`,
              zIndex: 2 - ((i + 0) % 2),
            }}
          >
            {props.bubbleElement(i, seat, valueMod === i)}
          </div>
        );
      })}

      {/* Clock face */}
      <div ref={circleRef} onClick={props.onSelect} className="aspect-square w-[90%] rounded-full bg-neutral-300" />

      {/* Arrow */}
      <div
        className="pointer-events-none absolute z-0 h-[2px] w-[37.2%] origin-left bg-neutral-600 transition-all"
        style={{
          transform: `translateX(50%) rotate(${0.25 + arrow / props.labels.length}turn)`,
        }}
      />

      {/* Dot */}
      <div className="absolute aspect-square h-3 rounded-full bg-neutral-800" />
    </div>
  );
}

/**
 * Calculate arrow position, so that it moves in the shortest direction.
 */
function calcArrowPosition(p: number, i: number, l: number) {
  // Fun fact: python modulo operator is not the same as JS modulo operator
  const f = Math.floor(p / l);
  const a = mod(p, l);

  if (Math.abs(a - i) > Math.floor(l / 2)) {
    return (f + Math.sign(a - i)) * l + i;
  } else {
    return f * l + i;
  }
}
