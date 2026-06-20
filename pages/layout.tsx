import { useEffect, type ReactNode } from "react";
import { useRouter } from "@void/react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AppThemeProvider } from "@/components/theme-provider";
import { SITE } from "@/lib/site";
import "@/style.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const gtmId = import.meta.env.VITE_GTM_ID as string | undefined;

  useEffect(() => {
    if (!gtmId) return;
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: "page_view", page_path: router.path });
  }, [router.path, gtmId]);

  return (
    <AppThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-svh flex-col">
        {gtmId ? (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        ) : null}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-background focus:text-foreground focus:px-3 focus:py-2 focus:border focus:border-primary"
        >
          Skip to main content
        </a>
        <Header path={router.path} />
        <main id="main" className="flex-1 py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
          <div className="max-w-[1100px] mx-auto">{children}</div>
        </main>
        <Footer />
        <link rel="canonical" href={SITE.url} />
      </div>
    </AppThemeProvider>
  );
}
