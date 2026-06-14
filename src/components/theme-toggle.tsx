import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "@/components/theme-provider";

export function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="text-muted-foreground hover:text-primary transition-colors active:scale-95"
    >
      {isDark ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </button>
  );
}
