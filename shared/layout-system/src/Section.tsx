import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** `common.css` — removes block padding */
  flush?: boolean;
  /** `reset.css` — tighter vertical padding */
  tight?: boolean;
  /**
   * Extra section modifiers, e.g. `ed-section hero ed-hero has-swiper`
   * Always includes base `section`.
   */
  variant?: string;
};

/**
 * Vertical band. Class contract: `section` + optional `is-flush` / `is-tight` + editorial variants.
 * Matches `common.css` + `reset.css` stacking rules (hero, adjacent sections, etc.).
 */
export function Section({
  children,
  className,
  flush,
  tight,
  variant,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cx("section", variant, flush && "is-flush", tight && "is-tight", className)}
      {...rest}
    >
      {children}
    </section>
  );
}
