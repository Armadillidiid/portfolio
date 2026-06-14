import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider, useTheme as useNextTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

type Mode = "dark" | "light";

type ThemeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mode: Mode = mounted && resolvedTheme === "light" ? "light" : "dark";

  const value: ThemeContextValue = {
    mode,
    setMode: (next) => setTheme(next),
    toggle: () => setTheme(mode === "dark" ? "light" : "dark"),
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function AppThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} {...props}>
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </ThemeProvider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within AppThemeProvider");
  return ctx;
}
