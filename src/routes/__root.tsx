import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-background focus:text-foreground focus:px-3 focus:py-2 focus:border focus:border-primary"
      >
        Skip to main content
      </a>
      <Header pathname={pathname} />
      <main id="main" className="flex-1 py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
