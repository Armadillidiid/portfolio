import type { ReactNode } from "react";

interface Prop {
  children: ReactNode;
  style?: string;
  id?: string;
}

const SectionTitle = ({ children, style, id }: Prop) => {
  return (
    <h3
      id={id}
      className={`${style} text-lg md:text-xl lg:text-3xl 2xl:text-3xl font-semibold text-neutral-700 dark:text-white mb-4`}
    >
      {children}
    </h3>
  );
};

export default SectionTitle;
