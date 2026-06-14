import { cn } from "@/lib/utils";

type TerminalLineProps = {
  command: string;
  className?: string;
};

export function TerminalLine({ command, className }: TerminalLineProps) {
  return (
    <p className={cn("text-primary text-sm", className)}>
      <span className="opacity-70">$</span> {command}
    </p>
  );
}
