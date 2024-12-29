import { Text, type BaseTextProps } from "../text";

type LabelProps = BaseTextProps & React.ComponentPropsWithoutRef<"label">;

function Label({ children, ...rest }: LabelProps) {
  return (
    <Text as="label" {...rest}>
      {children}
    </Text>
  );
}

export default Label;
