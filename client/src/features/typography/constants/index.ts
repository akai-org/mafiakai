import type {
  FontAlignment,
  FontWeight,
  TextSize,
  HeadingSize,
  HeadingLevels,
} from "../types";

const fontAlignment: Record<FontAlignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const fontWeights: Record<FontWeight, string> = {
  light: "font-light",
  normal: "font-normal",
  semibold: "font-semibold",
  bold: "font-bold",
};

const textSizes: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const headingSizes: Record<HeadingSize, string> = {
  "6xl": "text-6xl",
  "5xl": "text-5xl",
  "4xl": "text-4xl",
  "3xl": "text-3xl",
  "2xl": "text-2xl",
  xl: "text-xl",
};

const headingLevelSizes: Record<HeadingLevels, string> = {
  1: "text-6xl",
  2: "text-5xl",
  3: "text-4xl",
  4: "text-3xl",
  5: "text-2xl",
  6: "text-xl",
};

const MAIN_FONT_CLR = "text-gray-900";
const SEC_FONT_CLR = "text-gray-400";

export {
  fontAlignment,
  fontWeights,
  textSizes,
  headingSizes,
  headingLevelSizes,
  MAIN_FONT_CLR,
  SEC_FONT_CLR,
};
