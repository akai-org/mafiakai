import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  size?: "button-sm" | "button-md" | "button-lg";
  variant?: "button-solid" | "button-outline";
}

function Button({
  children,
  variant = "button-solid",
  size = "button-md",
  className: customClassName,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md font-bold",
        variant,
        size,
        disabled && "opacity-60",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        customClassName
      )}
      disabled={disabled}
      aria-disabled={disabled}
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
