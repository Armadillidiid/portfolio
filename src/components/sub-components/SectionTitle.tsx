import type { ReactNode } from "react";

interface Prop {
  children: ReactNode;
  style?: string;
}

const SectionTitle = ({ children, style }: Prop) => {
  return (
    <h3 className={`${style} text-3xl font-semibold text-neutral-700 dark:text-white mb-4`}>{children}</h3>
  );
};

export default SectionTitle;
