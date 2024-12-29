import { Text, type BaseTextProps } from "../text";

type SpanProps = BaseTextProps & React.ComponentPropsWithoutRef<"span">;

function Span({ children, ...rest }: SpanProps) {
  return (
    <Text as="span" {...rest}>
      {children}
    </Text>
  );
}

export default Span;
