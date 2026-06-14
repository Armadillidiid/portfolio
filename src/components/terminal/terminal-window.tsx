import { cn } from "@/lib/utils";

type TerminalWindowProps = {
  filename: string;
  className?: string;
  children: React.ReactNode;
};

export function TerminalWindow({ filename, className, children }: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border overflow-hidden transition-colors duration-500 hover:border-primary/50",
        className,
      )}
    >
      <div className="bg-muted border-b border-border px-4 py-3 flex justify-between items-center">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-destructive/40" aria-hidden="true" />
          <span className="size-3 rounded-full bg-secondary/40" aria-hidden="true" />
          <span className="size-3 rounded-full bg-primary/40" aria-hidden="true" />
        </div>
        <span className="text-xs text-muted-foreground opacity-50 select-none truncate">
          bash &mdash; {filename}
        </span>
        <div className="w-12" aria-hidden="true" />
      </div>
      <div className="p-8 space-y-6">{children}</div>
    </div>
  );
}
