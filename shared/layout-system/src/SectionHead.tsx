import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type SectionHeadProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** `common.css` `.section-head-center` */
  isCenter?: boolean;
};

/** Intro block (`common.css` `.section-head`) */
export function SectionHead({ children, className, isCenter, ...rest }: SectionHeadProps) {
  return (
    <div className={cx("section-head", isCenter && "section-head-center", className)} {...rest}>
      {children}
    </div>
  );
}
