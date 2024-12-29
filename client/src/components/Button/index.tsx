import clsx from "clsx";
import type { ButtonProps } from "./types";
import { baseStyles, sizeStyles, variantStyles } from "./constants";

function Button({
  children,
  size = "md",
  isDisabled,
  variant = "solid",
  className: customClassName,
  fullwidth = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullwidth && "w-full",
        isDisabled && "opacity-70",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        customClassName
      )}
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
