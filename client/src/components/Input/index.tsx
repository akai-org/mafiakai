import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ ...props }: InputProps) {
  return (
    <input
      {...props}
      className={
        "rounded-md border-2 border-black px-2 py-2 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
      }
    />
  );
}

export default Input;
