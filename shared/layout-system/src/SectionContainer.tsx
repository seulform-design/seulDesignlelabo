import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type SectionContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** `section > .container` — inner max-width shell before `.content` */
export function SectionContainer({ children, className, ...rest }: SectionContainerProps) {
  return (
    <div className={cx("container", className)} {...rest}>
      {children}
    </div>
  );
}
