import type { ReactNode } from "react";

import "./placeholder.css";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Placeholder({ children, className }: Props): JSX.Element {
  return <div className={className || "placeholder__root"}>{children}</div>;
}
