import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppThemeProvider } from "@/components/theme-provider";
import { TanStackDevtools } from "@tanstack/react-devtools";
import "./style.css";

createRoot(document.getElementById("app")!).render(
  <AppThemeProvider>
    <App />
    {import.meta.env.DEV ? <TanStackDevtools /> : null}
  </AppThemeProvider>,
);
