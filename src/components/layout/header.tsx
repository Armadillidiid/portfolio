import { Link } from "@void/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: "ABOUT", href: "/" },
  { label: "BLOG", href: "/blog" },
] as const;

type HeaderProps = {
  path: string;
};

export function Header({ path }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav
        aria-label="Primary"
        className="flex justify-between items-center w-full max-w-[1100px] mx-auto px-4 py-4 md:px-8"
      >
        <Link
          href="/"
          className="font-bold text-primary tracking-tight"
          aria-label="Emmanuel Isenah — Home"
        >
          Emmanuel Isenah
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors pb-1 border-b-2",
                  active
                    ? "text-secondary border-primary"
                    : "text-muted-foreground border-transparent hover:text-secondary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
}
