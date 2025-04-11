import type React from "react";
import { useCallback, useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

interface Handlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const tagsToIgnore = "input, textarea, button, select, a, [contenteditable]";
const shouldIgnore = (e: Event) => {
  return e.target instanceof HTMLElement && (e.target.closest(tagsToIgnore) || e.target.matches(tagsToIgnore));
};

/**
  This hook calls the appropriate handler when the user swipes in the given direction on ref. Swipe on input, textarea, button, select, a, [contenteditable] is ignored.
*/
export default function useSwipe<E extends HTMLElement>(
  handlers: Handlers,
  sensiivity: number = 50
): React.RefCallback<E> {
  const clientStart = useRef<Point>({ x: 0, y: 0 });
  const clientEnd = useRef<Point>({ x: 0, y: 0 });

  const ref = useRef<E | null>(null);

  const handleStart = useCallback((x: number, y: number) => {
    clientStart.current = { x, y };
  }, []);

  const handleMove = useCallback(
    (x: number, y: number) => {
      clientEnd.current = { x, y };

      const diffX = clientEnd.current.x - clientStart.current.x;
      const diffY = clientEnd.current.y - clientStart.current.y;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > sensiivity && handlers.onSwipeRight) handlers.onSwipeRight();
        else if (diffX < -sensiivity && handlers.onSwipeLeft) handlers.onSwipeLeft();
      } else {
        if (diffY > sensiivity && handlers.onSwipeDown) handlers.onSwipeDown();
        else if (diffY < -sensiivity && handlers.onSwipeUp) handlers.onSwipeUp();
      }
    },
    [handlers, sensiivity]
  );

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (shouldIgnore(e)) return;
      handleStart(e.clientX, e.clientY);
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (shouldIgnore(e)) return;
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (shouldIgnore(e)) return;
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (shouldIgnore(e)) return;
      handleMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    };

    ref.current.addEventListener("mousedown", handleMouseDown);
    ref.current.addEventListener("mouseup", handleMouseUp);

    ref.current.addEventListener("touchstart", handleTouchStart);
    ref.current.addEventListener("touchmove", handleTouchEnd);

    return () => {
      if (!ref.current) return;
      ref.current.removeEventListener("mousedown", handleMouseDown);
      ref.current.removeEventListener("mouseup", handleMouseUp);

      ref.current.removeEventListener("touchstart", handleTouchStart);
      ref.current.removeEventListener("touchmove", handleTouchEnd);
    };
  }, [handleMove, handleStart]);

  return (el) => {
    if (!el) return;
    ref.current = el;
  };
}
