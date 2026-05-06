import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx, gapStyle, type GapToken } from "./utils";

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Full `grid-template-columns` value, e.g. `repeat(3, minmax(0, 1fr))` */
  columns?: string;
  /** Full `grid-template-rows` when needed */
  rows?: string;
  gap?: GapToken;
  /**
   * When true, uses the same gap as `.section .content` (64px) from `reset.css`.
   * Ignored if `gap` is set.
   */
  contentGap?: boolean;
};

/**
 * Explicit CSS grid for named grids (`card-grid-*`, custom columns) sitting inside `BodyWrap` or `Content`.
 * Base `body-wrap` already is a grid — use this for nested grids or non-section contexts.
 */
export function Grid({
  children,
  className,
  columns,
  rows,
  gap,
  contentGap,
  style,
  ...rest
}: GridProps) {
  const resolvedGap =
    gap !== undefined
      ? gapStyle(gap)
      : contentGap
        ? ({ gap: "64px" } as CSSProperties)
        : gapStyle("card");

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: columns,
    gridTemplateRows: rows,
    ...resolvedGap,
    ...style,
  };

  return (
    <div className={cx(className)} style={gridStyle} {...rest}>
      {children}
    </div>
  );
}
