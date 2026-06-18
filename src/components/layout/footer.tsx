const SOCIAL_LINKS = [
  { label: "GITHUB", href: "https://github.com/Armadillidiid" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/emmanuel-isenah-541593190" },
  { label: "TWITTER", href: "https://x.com/EIsenah" },
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
              target="_blank"
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
