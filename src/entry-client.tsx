import { createRouter, RouterProvider, ClientOnly } from "@tanstack/react-router";
import { hydrate } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { routeTree } from "./routeTree.gen";
import { AppThemeProvider } from "@/components/theme-provider";
import "./style.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStructuralSharing: true,
});

void hydrate(router).catch(() => {});
hydrateRoot(
  document.getElementById("app")!,
  <AppThemeProvider>
    <RouterProvider router={router} />
    {import.meta.env.DEV ? (
      <ClientOnly>
        <TanStackDevtools />
      </ClientOnly>
    ) : null}
  </AppThemeProvider>,
);
