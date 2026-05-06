import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type SectionBodyProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Body slot under head (`common.css` `.section-body`) */
export function SectionBody({ children, className, ...rest }: SectionBodyProps) {
  return (
    <div className={cx("section-body", className)} {...rest}>
      {children}
    </div>
  );
}
