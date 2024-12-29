const baseStyles = "rounded-md font-bold ";

const variantStyles = {
  solid:
    "bg-black text-white border-black hover:opacity-70 transition ease-in-out duration-200 disabled:opacity-60",
  outline:
    "bg-transparent border-black text-black hover:opacity-70 transition ease-in-out duration-200 disabled:opacity-60",
};

const sizeStyles = {
  sm: "px-6 py-2 text-sm border-2",
  md: "px-8 py-2 text-base border-[3px]",
  lg: "px-12 py-2 text-lg border-4",
};

export { baseStyles, variantStyles, sizeStyles };
