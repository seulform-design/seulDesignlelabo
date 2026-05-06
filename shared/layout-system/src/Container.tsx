import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Global width + horizontal padding (`common.css` `.container`).
 * For header/footer chrome, parent selectors in CSS zero out padding — structure only here.
 */
export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={cx("container", className)} {...rest}>
      {children}
    </div>
  );
}
