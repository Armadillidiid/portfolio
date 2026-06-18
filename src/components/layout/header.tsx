import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  to: string;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: "ABOUT", to: "/" },
  { label: "BLOG", to: "/blog" },
] as const;

type HeaderProps = {
  pathname: string;
};

export function Header({ pathname }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav
        aria-label="Primary"
        className="flex justify-between items-center w-full max-w-[1100px] mx-auto px-4 py-4 md:px-8"
      >
        <Link
          to="/"
          className="font-bold text-primary tracking-tight"
          aria-label="Emmanuel Isenah — Home"
        >
          Emmanuel Isenah
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
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
