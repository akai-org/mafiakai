import { useEffect } from "react";

export type Keys = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "Enter";

export default function useKeyDown(handlers: Partial<Record<Keys, () => void>>): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = handlers[e.key as Keys];
      if (handler) handler();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlers]);
}
