const SOCIAL_LINKS = [
  { label: "GITHUB", href: "#" },
  { label: "LINKEDIN", href: "#" },
  { label: "TWITTER", href: "#" },
] as const;

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1100px] mx-auto px-4 py-8 md:px-8 gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            &copy; {new Date().getFullYear()} EMMANUEL ISENAH. ALL RIGHTS RESERVED.
          </span>
        </div>
        <div className="flex gap-8">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase text-muted-foreground hover:text-secondary transition-colors hover:underline decoration-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
