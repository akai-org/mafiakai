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
        if (diffX > sensiivity && handlers.onSwipeRight)
          handlers.onSwipeRight();
        else if (diffX < -sensiivity && handlers.onSwipeLeft)
          handlers.onSwipeLeft();
      } else {
        if (diffY > sensiivity && handlers.onSwipeDown) handlers.onSwipeDown();
        else if (diffY < -sensiivity && handlers.onSwipeUp)
          handlers.onSwipeUp();
      }
    },
    [handlers, sensiivity]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => handleStart(e.clientX, e.clientY),
    [handleStart]
  );
  const handleMouseUp = useCallback(
    (e: MouseEvent) => handleMove(e.clientX, e.clientY),
    [handleMove]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];

      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  useEffect(() => {
    if (!ref.current) return;

    ref.current.addEventListener("touchstart", handleTouchStart);
    ref.current.addEventListener("touchmove", handleTouchEnd);

    return () => {
      if (!ref.current) return;

      ref.current.removeEventListener("touchstart", handleTouchStart);
      ref.current.removeEventListener("touchmove", handleTouchEnd);
    };
  }, [
    handlers,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
  ]);

  return (el) => {
    if (!el) return;
    ref.current = el;
  };
}
