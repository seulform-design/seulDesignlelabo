import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx, gapStyle, type GapToken } from "./utils";

export type FlexProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  direction?: "row" | "col";
  gap?: GapToken;
  wrap?: boolean;
  justify?: "start" | "end" | "center" | "between" | "around";
  align?: "start" | "end" | "center" | "stretch" | "baseline";
};

const justifyMap = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
} as const;

const alignMap = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
} as const;

/**
 * Token-aware flex wrapper when you need layout not covered by `.title-wrap` / `.section-content`.
 * Does not replace those primitives — use for small clusters (actions, meta rows).
 */
export function Flex({
  children,
  className,
  direction = "row",
  gap,
  wrap,
  justify = "start",
  align = "stretch",
  style,
  ...rest
}: FlexProps) {
  const flexStyle: CSSProperties = {
    display: "flex",
    flexDirection: direction === "col" ? "column" : "row",
    flexWrap: wrap ? "wrap" : undefined,
    justifyContent: justifyMap[justify],
    alignItems: alignMap[align],
    ...gapStyle(gap),
    ...style,
  };

  return (
    <div className={cx(className)} style={flexStyle} {...rest}>
      {children}
    </div>
  );
}
