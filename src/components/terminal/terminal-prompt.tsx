import { cn } from "@/lib/utils";

type TerminalPromptProps = {
  user?: string;
  host?: string;
  className?: string;
};

export function TerminalPrompt({
  user = "emmanuel",
  host = "blog",
  className,
}: TerminalPromptProps) {
  return (
    <div className={cn("text-sm text-primary", className)}>
      <span className="opacity-70">
        {user}@{host}:~$
      </span>
      <span
        aria-hidden="true"
        className="cursor-blink bg-primary w-2 h-4 inline-block align-middle ml-1"
      />
    </div>
  );
}
