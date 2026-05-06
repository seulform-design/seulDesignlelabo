import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type TitleWrapProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** `reset.css` `.title-wrap.is-center` */
  isCenter?: boolean;
  /** `reset.css` `.title-wrap.is-end` */
  isEnd?: boolean;
};

/** Section headline stack (`reset.css` `.section .title-wrap`) */
export function TitleWrap({ children, className, isCenter, isEnd, ...rest }: TitleWrapProps) {
  return (
    <div className={cx("title-wrap", isCenter && "is-center", isEnd && "is-end", className)} {...rest}>
      {children}
    </div>
  );
}
