import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  style?: string;
}

const SectionDescription = ({ children, style }: Props) => {
  return (
    <h3 className={`${style} text-8xl dark:text-white font-semibold tracking-tighter mb-12`}>
      {children}
    </h3>
  );
};

export default SectionDescription;
