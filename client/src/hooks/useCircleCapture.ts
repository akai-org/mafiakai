import { useEffect, useMemo, useRef, useState, type RefCallback } from "react";

interface Point {
  x: number;
  y: number;
}

/**
 * This hook captures the position of the mouse or touch event on the circle element.
 * @param slides Number of panels that the circle is divided into.
 * @param degreesOffset Offset in degrees.
 * @returns [ref, currentSlide, currentMove] - ref should be attached to the circle element, currentSlide is the current panel.
 */
export default function useCircleCapture<E extends HTMLElement>(
  slides: number,
  degreesOffset: number = 0
): [RefCallback<E>, number] {
  const ref = useRef<E | null>(null);

  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });

  const slide = useMemo(() => {
    // calculate angle in radians
    const rad = Math.atan2(mousePosition.y, mousePosition.x);
    const degrees = (rad * 180) / Math.PI + 360;
    const shift = (degrees + degreesOffset) % 360;

    // calculate slide
    return Math.floor((shift / 360) * slides);
  }, [mousePosition, slides, degreesOffset]);

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseUp = (e: MouseEvent) => e.stopPropagation();
    const handleMouseMove = function (this: HTMLElement, e: MouseEvent) {
      e.stopPropagation();

      const cx = e.offsetX - this.offsetWidth / 2;
      const cy = e.offsetY - this.offsetHeight / 2;
      setMousePosition({ x: cx, y: cy });
    };

    const handleTouchEnd = (e: TouchEvent) => e.stopPropagation();
    const handleTouchMove = function (this: HTMLElement, e: TouchEvent) {
      e.stopPropagation();

      const touch = e.touches[0];
      const { x, y } = this.getBoundingClientRect();
      const cx = touch.clientX - x - this.offsetWidth / 2;
      const cy = touch.clientY - y - this.offsetHeight / 2;
      setMousePosition({ x: cx, y: cy });
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
  }, [ref]);

  return [
    (el) => {
      if (el) ref.current = el;
    },
    slide,
  ];
}
