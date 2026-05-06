import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type BodyWrapProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Card / grid region (`reset.css` `.section .body-wrap`):
 * `display: grid; gap: var(--card-gap)`.
 */
export function BodyWrap({ children, className, ...rest }: BodyWrapProps) {
  return (
    <div className={cx("body-wrap", className)} {...rest}>
      {children}
    </div>
  );
}
