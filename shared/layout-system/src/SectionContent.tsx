import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type SectionContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Alternate vertical stack (`common.css` `.section-content`):
 * flex column, `gap: var(--section-head-gap)`.
 */
export function SectionContent({ children, className, ...rest }: SectionContentProps) {
  return (
    <div className={cx("section-content", className)} {...rest}>
      {children}
    </div>
  );
}
