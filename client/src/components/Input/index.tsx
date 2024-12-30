import { forwardRef, type ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    className={
      "rounded-md border-2 border-black px-2 py-2 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
    }
  />
));

export default Input;
