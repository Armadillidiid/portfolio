import {
  definePlugin,
  ExpressiveCode,
  type ExpressiveCodeBlock,
  type ExpressiveCodeBlockOptions,
  type ExpressiveCodePlugin,
  loadShikiTheme,
} from "expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { inlineFileIcons } from "@/lib/inline-file-icons";
import { toHtml } from "hast-util-to-html";

type CodeBlockWithIcon = ExpressiveCodeBlock & { props: { icon?: string } };

const defaultFileIconByLanguage: Record<string, string> = {
  ts: "typescript",
  tsx: "reactts",
  jsx: "reactjs",
};

const mapLanguageToFileIcon = definePlugin({
  name: "map-language-to-file-icon",
  hooks: {
    preprocessMetadata({ codeBlock }: { codeBlock: CodeBlockWithIcon }) {
      const explicitIcon = codeBlock.metaOptions.getString("icon");
      if (explicitIcon || codeBlock.props.icon) return;
      const mappedIcon = defaultFileIconByLanguage[codeBlock.language.toLowerCase()];
      if (mappedIcon) codeBlock.props.icon = mappedIcon;
    },
  },
});

const codeBlockSlugCountsByDoc = new Map<string, Map<string, number>>();

const slugifyCodeId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getClassNames = (
  node: { properties?: { className?: unknown; class?: unknown } } | null | undefined,
): string[] => {
  const value = node?.properties?.className ?? node?.properties?.class;
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") return value.split(/\s+/);
  return [];
};

const hasClass = (
  node: { properties?: { className?: unknown; class?: unknown } } | null | undefined,
  className: string,
) => getClassNames(node).includes(className);

const getTagName = (node: { tagName?: string; name?: string } | null | undefined): string =>
  node?.tagName ?? node?.name ?? "";

type HastNode = {
  type?: string;
  tagName?: string;
  name?: string;
  properties?: { className?: unknown; class?: unknown; id?: string };
  children?: unknown[];
};

const findChild = (
  node: HastNode | null | undefined,
  tagName: string,
  className?: string,
): HastNode | null => {
  for (const child of node?.children ?? []) {
    const c = child as HastNode;
    if (c?.type !== "element" || getTagName(c) !== tagName) continue;
    if (!className || hasClass(c, className)) return c;
  }
  return null;
};

const addCodeBlockAnchors = definePlugin({
  name: "add-code-block-anchors",
  hooks: {
    postprocessRenderedBlock({
      codeBlock,
      renderData,
    }: {
      codeBlock: ExpressiveCodeBlock;
      renderData: { blockAst: HastNode };
    }) {
      const title = codeBlock.metaOptions.getString("title");
      if (!title?.trim()) return;

      const docKey = codeBlock.parentDocument?.sourceFilePath ?? "__unknown_document__";
      if (!codeBlockSlugCountsByDoc.has(docKey)) {
        codeBlockSlugCountsByDoc.set(docKey, new Map());
      }
      const slugCounts = codeBlockSlugCountsByDoc.get(docKey)!;

      const baseSlug = slugifyCodeId(title) || "code";
      const count = (slugCounts.get(baseSlug) ?? 0) + 1;
      slugCounts.set(baseSlug, count);
      const id = count === 1 ? baseSlug : `${baseSlug}-${count}`;

      renderData.blockAst.properties ??= {};
      renderData.blockAst.properties.id = id;

      const figure =
        renderData.blockAst?.type === "element" &&
        getTagName(renderData.blockAst) === "figure" &&
        hasClass(renderData.blockAst, "frame")
          ? renderData.blockAst
          : findChild(renderData.blockAst, "figure", "frame");
      const header = figure && findChild(figure, "figcaption", "header");
      const titleNode = header && findChild(header, "span", "title");
      if (!titleNode) return;

      const hasAnchor = (titleNode.children ?? []).some(
        (child) =>
          (child as HastNode)?.type === "element" &&
          (child as HastNode).tagName === "a" &&
          hasClass(child as HastNode, "code-anchor"),
      );
      if (hasAnchor) return;

      titleNode.children ??= [];
      titleNode.children.push({
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          ariaLabel: `Permalink: ${title}`,
          className: ["code-anchor"],
        },
        children: [
          {
            type: "element",
            tagName: "svg",
            properties: {
              className: ["anchor-icon"],
              viewBox: "0 0 16 16",
              ariaHidden: "true",
            },
            children: [
              {
                type: "element",
                tagName: "path",
                properties: {
                  d: "m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z",
                },
                children: [],
              },
            ],
          },
        ],
      });
    },
  },
});

let enginePromise: Promise<ExpressiveCode> | null = null;

async function buildEngine(): Promise<ExpressiveCode> {
  const engine = new ExpressiveCode({
    themes: [await loadShikiTheme("night-owl-light"), await loadShikiTheme("night-owl")],
    useDarkModeMediaQuery: false,
    themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : false),
    defaultProps: {
      showLineNumbers: true,
      collapseStyle: "collapsible-auto",
    },
    styleOverrides: {
      frames: { shadowColor: "none" },
    },
    plugins: [
      pluginCollapsibleSections(),
      pluginLineNumbers(),
      mapLanguageToFileIcon,
      inlineFileIcons,
      addCodeBlockAnchors,
    ] as ExpressiveCodePlugin[],
  });
  await engine.getBaseStyles();
  return engine;
}

function getEngine(): Promise<ExpressiveCode> {
  if (!enginePromise) {
    enginePromise = buildEngine();
  }
  return enginePromise;
}

let stylesMounted = false;

export async function mountExpressiveCodeStyles(): Promise<void> {
  if (stylesMounted) return;
  if (typeof document === "undefined") return;
  const engine = await getEngine();
  const base = await engine.getBaseStyles();
  const theme = await engine.getThemeStyles();
  const jsModules = await engine.getJsModules();

  const style = document.createElement("style");
  style.setAttribute("data-expressive-code", "");
  style.textContent = base + theme;
  document.head.appendChild(style);

  for (const js of jsModules) {
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = js;
    document.head.appendChild(script);
  }

  stylesMounted = true;
}

export async function renderCodeBlock(input: {
  code: string;
  language: string;
  meta?: string;
}): Promise<string> {
  const engine = await getEngine();
  const { renderedGroupAst } = await engine.render({
    code: input.code,
    language: input.language,
    meta: input.meta ?? "",
  } as ExpressiveCodeBlockOptions);
  return toHtml(renderedGroupAst);
}
