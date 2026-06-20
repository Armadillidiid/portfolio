import type { ReactNode } from "react";
import "@void/md/theme-content.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="void-md max-w-3xl mx-auto">{children}</div>;
}
