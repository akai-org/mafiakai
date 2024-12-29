import React from "react";
import clsx from "clsx";
import type { FontAlignment, FontWeight, TextSize } from "../../types";
import {
  fontAlignment,
  fontWeights,
  MAIN_FONT_CLR,
  SEC_FONT_CLR,
  textSizes,
} from "../../constants";
type TextElement = Exclude<
  keyof JSX.IntrinsicElements,
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "a" | "button"
>;

export interface BaseTextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: FontWeight;
  align?: FontAlignment;
  isSubText?: boolean;
}

type TextProps<T extends TextElement> = BaseTextProps & {
  as?: T;
} & Omit<JSX.IntrinsicElements[T], keyof BaseTextProps>;

function Text<T extends TextElement>({
  children,
  align,
  className: customClassName,
  as,
  size = "base",
  weight = "normal",
  isSubText = false,
  ...rest
}: TextProps<T>) {
  const TextTag = (as ?? "p") as React.ElementType;

  const classNames = clsx(
    textSizes[size],
    fontWeights[weight],
    align && fontAlignment[align],
    isSubText ? SEC_FONT_CLR : MAIN_FONT_CLR,
    customClassName
  );

  return (
    <TextTag {...rest} className={classNames}>
      {children}
    </TextTag>
  );
}

export default Text;
