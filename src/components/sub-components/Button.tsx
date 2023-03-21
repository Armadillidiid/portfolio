import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  styles?: string;
  handleClick?: (fn: any) => void;
}

const Button = ({ children, styles }: Props) => {
  return (
    <button
      className={`${
        styles ?? ""
      } bg-blue-500 transition active:scale-[0.97] text-white hover:transition hover:bg-blue-600`}
    >
      {children}
    </button>
  );
};

export default Button;
