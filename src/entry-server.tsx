import { createRouter } from "@tanstack/react-router";
import { createMemoryHistory } from "@tanstack/react-router";
import { RouterServer } from "@tanstack/react-router/ssr/server";
import { attachRouterServerSsrUtils } from "@tanstack/react-router/ssr/server";
import ReactDOMServer from "react-dom/server";
import { routeTree } from "./routeTree.gen";
import { AppThemeProvider } from "@/components/theme-provider";

export async function render(url: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
    defaultPreload: false,
    defaultStructuralSharing: true,
    isServer: true,
  });

  attachRouterServerSsrUtils({ router, manifest: undefined });

  await router.load();
  await router.serverSsr?.dehydrate();

  const appHtml = ReactDOMServer.renderToString(
    <AppThemeProvider>
      <RouterServer router={router} />
    </AppThemeProvider>,
  );

  const headTagPattern = /<(title|meta|link)[^>]*\/?>[^<]*(?:<\/\1>)?/gi;
  const headTags: string[] = [];
  const bodyHtml = appHtml.replace(headTagPattern, (match) => {
    headTags.push(match);
    return "";
  });

  router.serverSsr?.setRenderFinished();
  const dehydrate = router.serverSsr?.takeBufferedHtml() || "";
  router.serverSsr?.cleanup();

  return {
    html: bodyHtml,
    head: headTags.join("\n"),
    dehydrate,
    statusCode: router.stores.statusCode.get(),
  };
}
