import { useCallback, useEffect, useRef, useState, type RefCallback } from "react";

/**
 * This hook captures the position of the mouse or touch event on the circle element.
 * @param slides Number of panels that the circle is divided into.
 * @param degreesOffset Offset in degrees.
 * @returns [ref, currentSlide] - ref should be attached to the circle element, currentSlide is the current panel.
 */
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

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseUp = (e: MouseEvent) => e.stopPropagation();
    const handleMouseMove = function (this: HTMLElement, e: MouseEvent) {
      e.stopPropagation();

      const cx = e.offsetX - this.offsetWidth / 2;
      const cy = e.offsetY - this.offsetHeight / 2;
      handlePosition(cx, cy);
    };

    const handleTouchEnd = (e: TouchEvent) => e.stopPropagation();
    const handleTouchMove = function (this: HTMLElement, e: TouchEvent) {
      e.stopPropagation();

      const touch = e.touches[0];
      const { x, y } = this.getBoundingClientRect();
      const cx = touch.clientX - x - this.offsetWidth / 2;
      const cy = touch.clientY - y - this.offsetHeight / 2;
      handlePosition(cx, cy);
    };

    ref.current.addEventListener("mousemove", handleMouseMove);
    ref.current.addEventListener("mouseup", handleMouseUp);

    ref.current.addEventListener("touchmove", handleTouchMove);
    ref.current.addEventListener("touchend", handleTouchEnd);

    return () => {
      ref.current?.removeEventListener("mousemove", handleMouseMove);
      ref.current?.removeEventListener("mouseup", handleMouseUp);

      ref.current?.removeEventListener("touchmove", handleTouchMove);
      ref.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handlePosition]);

  return [
    (el) => {
      if (!el) return;
      ref.current = el;
    },
    slide,
  ];
}
