import clsx from "clsx";
import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    className={clsx(
      "rounded-md border-2 border-black px-2 py-2 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black",
      className
    )}
  />
));

export default Input;
