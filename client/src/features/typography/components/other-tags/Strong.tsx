import { Text, type BaseTextProps } from "../text";

type StrongProps = BaseTextProps & React.ComponentPropsWithoutRef<"strong">;

function Strong({ children, ...rest }: Omit<StrongProps, "fontWeight">) {
  return (
    <Text as="strong" weight="bold" {...rest}>
      {children}
    </Text>
  );
}

export default Strong;
