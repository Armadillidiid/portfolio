import { Inbox } from "lucide-react";

type TerminalIconProps = {
  href: string;
  label: string;
};

export function TerminalIcon({ href, label }: TerminalIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className="text-muted-foreground hover:text-primary transition-colors active:scale-95"
    >
      <Inbox aria-hidden="true" />
    </a>
  );
}
