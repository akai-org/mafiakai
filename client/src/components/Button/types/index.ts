type ButtonHTMLProps = Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  "disabled" | "aria-disabled"
>;

interface ButtonProps extends ButtonHTMLProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  variant?: "solid" | "outline";
  fullwidth?: boolean;
}

export type { ButtonHTMLProps, ButtonProps };
