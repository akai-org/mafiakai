import React from "react";
import clsx from "clsx";
import type { FontAlignment, HeadingLevels, HeadingSize } from "../../types";
import {
  fontAlignment,
  headingLevelSizes,
  headingSizes,
  MAIN_FONT_CLR,
} from "../../constants";

export interface BaseHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevels;
  size?: HeadingSize;
  align?: FontAlignment;
  children: React.ReactNode;
}

function Heading({
  level,
  size,
  align,
  children,
  className: customClassName,
}: BaseHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={clsx(
        MAIN_FONT_CLR,
        size ? headingSizes[size] : headingLevelSizes[level],
        "font-bold",
        align && fontAlignment[align],
        customClassName
      )}
    >
      {children}
    </HeadingTag>
  );
}

export default Heading;
