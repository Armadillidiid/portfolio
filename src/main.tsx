import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppThemeProvider } from "@/components/theme-provider";
import "./style.css";

createRoot(document.getElementById("app")!).render(
  <AppThemeProvider>
    <App />
  </AppThemeProvider>,
);
