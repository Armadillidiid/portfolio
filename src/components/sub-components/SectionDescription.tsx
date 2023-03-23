import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SectionDescription = ({ children }: Props) => {
  return (
    <h3 className="text-8xl dark:text-white font-semibold tracking-tighter mb-12">
      {children}
    </h3>
  );
};

export default SectionDescription;
