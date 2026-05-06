import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type MainProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

/** Matches `main#main-content` landmark + overflow contract from page-shell.css */
export function Main({ children, className, id = "main-content", "aria-label": ariaLabel, ...rest }: MainProps) {
  return (
    <main id={id} className={cx(className)} aria-label={ariaLabel} {...rest}>
      {children}
    </main>
  );
}
