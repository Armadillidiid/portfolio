import type { ReactNode } from "react";

interface Prop {
  children: ReactNode;
}

const SectionTitle = ({ children }: Prop) => {
  return (
    <h3 className="text-3xl font-semibold text-neutral-700 mb-4">{children}</h3>
  );
};

export default SectionTitle;
