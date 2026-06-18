import type { Plugin } from "vite-plus";

const HEAD_PLACEHOLDER = "<!--GTM_HEAD_PLACEHOLDER-->";
const NOSCRIPT_PLACEHOLDER = "<!--GTM_NOSCRIPT_PLACEHOLDER-->";

function renderGtmHead(id: string): string {
  return [
    HEAD_PLACEHOLDER,
    `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
    `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`,
    `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`,
    `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
    `})(window,document,'script','dataLayer','${id}');</script>`,
  ].join("");
}

function renderGtmNoscript(id: string): string {
  return [
    NOSCRIPT_PLACEHOLDER,
    `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"`,
    `height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
  ].join("");
}

export function gtmInjectPlugin(): Plugin {
  return {
    name: "gtm-inject",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const id = process.env.VITE_GTM_ID?.trim();
        if (!id) {
          return html.replace(HEAD_PLACEHOLDER, "").replace(NOSCRIPT_PLACEHOLDER, "");
        }
        return html
          .replace(HEAD_PLACEHOLDER, renderGtmHead(id))
          .replace(NOSCRIPT_PLACEHOLDER, renderGtmNoscript(id));
      },
    },
  };
}
