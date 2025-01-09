import { useCallback, useEffect, useRef, useState, type RefCallback } from "react";

export default function useCircleCapture<E extends HTMLElement>(
  slides: number,
  degreesOffset: number = 0
): [RefCallback<E>, number] {
  const ref = useRef<E | null>(null);
  const [slide, setSlide] = useState<number>(0);

  const handlePosition = useCallback(
    (cx: number, cy: number) => {
      // calculate angle in radians
      const rad = Math.atan2(cy, cx);
      const degrees = (rad * 180) / Math.PI + 360;
      const shift = (degrees + degreesOffset) % 360;

      // calculate slide
      setSlide(Math.floor((shift / 360) * slides));
    },
    [slides, degreesOffset]
  );

  const handleMouseMove = useCallback(
    function (this: HTMLElement, e: MouseEvent) {
      const cx = e.offsetX - this.offsetWidth / 2;
      const cy = e.offsetY - this.offsetHeight / 2;
      handlePosition(cx, cy);
    },
    [handlePosition]
  );

  const handleTouchMove = useCallback(
    function (this: HTMLElement, e: TouchEvent) {
      const touch = e.touches[0];
      const { x, y } = this.getBoundingClientRect();
      const cx = touch.clientX - x - this.offsetWidth / 2;
      const cy = touch.clientY - y - this.offsetHeight / 2;
      handlePosition(cx, cy);
    },
    [handlePosition]
  );

  useEffect(() => {
    if (!ref.current) return;

    ref.current.addEventListener("mousemove", handleMouseMove);
    ref.current.addEventListener("touchmove", handleTouchMove);

    return () => {
      ref.current?.removeEventListener("mousemove", handleMouseMove);
      ref.current?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  return [
    (el) => {
      if (!el) return;
      ref.current = el;
    },
    slide,
  ];
}
