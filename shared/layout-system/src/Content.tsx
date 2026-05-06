import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type ContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * `reset.css` `.section .content` — single-column CSS grid, gap 64px between major stacks
 * (title block vs body, etc.).
 */
export function Content({ children, className, ...rest }: ContentProps) {
  return (
    <div className={cx("content", className)} {...rest}>
      {children}
    </div>
  );
}
