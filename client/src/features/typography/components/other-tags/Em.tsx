import { Text, type BaseTextProps } from "../text";

type EmProps = BaseTextProps & React.ComponentPropsWithoutRef<"em">;

function Em({ children, ...rest }: EmProps) {
  return (
    <Text as="em" {...rest}>
      {children}
    </Text>
  );
}

export default Em;
