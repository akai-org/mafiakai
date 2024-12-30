import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "button-sm" | "button-md" | "button-lg";
  variant?: "button-solid" | "button-outline";
  disabled?: boolean;
}

function Button({
  children,
  variant = "button-solid",
  size = "button-md",
  disabled = false,
  className: customClassName,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md font-bold",
        variant,
        size,
        disabled && "opacity-70",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        customClassName
      )}
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
