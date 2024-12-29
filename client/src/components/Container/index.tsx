import clsx from "clsx";

interface ContainerProps extends React.InputHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={clsx("m-auto mx-4", className)} {...props}>
      {children}
    </div>
  );
}

export default Container;
