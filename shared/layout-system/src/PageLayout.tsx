import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type PageLayoutProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** e.g. `page-index` — matches body class on main */
  pageClass?: string;
};

/**
 * Root chrome wrapper. Matches `#wrap` + optional page scope class
 * (main site uses `body.page-index`; in SPA mirror on this node or body via your app shell).
 */
export function PageLayout({ children, pageClass, className, id = "wrap", ...rest }: PageLayoutProps) {
  return (
    <div id={id} className={cx(pageClass, className)} {...rest}>
      {children}
    </div>
  );
}
