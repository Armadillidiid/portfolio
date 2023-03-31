import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  style?: string;
}

const SectionDescription = ({ children, style }: Props) => {
  return (
    <h3
      className={`${style} text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-8xl dark:text-white font-semibold tracking-tighter mb-12`}
    >
      {children}
    </h3>
  );
};

export default SectionDescription;
