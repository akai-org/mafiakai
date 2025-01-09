/* eslint-disable react-hooks/exhaustive-deps */
// useEffect deps are fine, the linter is wrong

import useCircleCapture from "@/hooks/useCircleCapture";
import { mod } from "@/utils/mod";
import { Children, useEffect, useMemo, useState, type PropsWithChildren } from "react";

/**
 * Input shaped like a clock, with a pointer that can be moved around the clock face.
 * @param pointer - pointer position
 * @param onChange - callback when pointer position changes
 * @param length - number of positions
 * @param onClick - callback when clock face is clicked
 * @param children - elements to be placed on the clock face, they will be placed evenly around the clock face
 */
export default function ClockInput(
  props: PropsWithChildren<{
    onChange?: (pointer: number) => void;
    pointer?: number;
    length: number;
    onClick?: () => void;
  }>
) {
  const pointerMod = useMemo(() => mod(props.pointer ?? 0, props.length), [props.pointer, props.length]);

  const [position, setPosition] = useState<number>(0);
  const arrow = useMemo(() => mod(position, props.length), [position, props.length]);
  const [circleRef, slide] = useCircleCapture(props.length, 180 / props.length);

  // Update arrow by props
  useEffect(() => {
    if (pointerMod !== arrow) setPosition((p) => calcArrowPosition(p, pointerMod, props.length));
  }, [props.pointer, props.length]);

  // Update arrow by mouse
  useEffect(() => {
    if (slide !== arrow) {
      setPosition((p) => calcArrowPosition(p, slide, props.length));
      if (props.onChange) props.onChange(slide); // Update parent
    }
  }, [slide]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {Children.map(props.children, (child, i) => {
        return (
          <div
            key={i + "bubble"}
            className="pointer-events-none absolute aspect-square w-[12%] transition-transform"
            style={{
              transform: ` rotate(${i / props.length}turn) translate(310%) ${arrow === i ? "translateX(50%)" : ""} rotate(${-i / props.length}turn)`,
              zIndex: 2 - ((i + 0) % 2),
            }}
          >
            {child}
          </div>
        );
      })}
      {/* Clock face */}
      <div ref={circleRef} onClick={props.onClick} className="aspect-square w-[90%] rounded-full bg-neutral-300" />

      {/* Arrow */}
      <div
        className="pointer-events-none absolute z-0 h-[2px] w-[38.5%] origin-left bg-neutral-600 transition-all"
        style={{
          transform: `translateX(50%) rotate(${position / props.length}turn)`,
        }}
      />

      {/* Dot */}
      <div className="absolute aspect-square h-3 rounded-full bg-neutral-800" />
    </div>
    // </div>
  );
}

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
