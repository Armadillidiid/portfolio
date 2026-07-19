import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mountExpressiveCodeStyles, renderCodeBlock } from "@/lib/expressive-code";
import { remarkCodeMeta } from "@/lib/remark-code-meta";

function CodeBlock({ code, language, meta }: { code: string; language: string; meta?: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void renderCodeBlock({ code, language, meta }).then((out) => {
      if (!cancelled) setHtml(out);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language, meta]);

  if (!html) {
    return (
      <pre className="border border-border overflow-x-auto text-sm font-mono p-4">
        <code>{code}</code>
      </pre>
    );
  }

  return <div className="expressive-code my-6" dangerouslySetInnerHTML={{ __html: html }} />;
}

type MarkdownContentProps = {
  body: string;
};

export function MarkdownContent({ body }: MarkdownContentProps) {
  useEffect(() => {
    void mountExpressiveCodeStyles();
  }, []);

  return (
    <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
      <Markdown
        remarkPlugins={[remarkGfm, remarkCodeMeta]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-foreground mt-12 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-foreground mt-8 mb-3">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-base text-muted-foreground leading-relaxed">{children}</p>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-secondary underline underline-offset-4 hover:text-primary"
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 marker:text-primary">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 marker:text-primary">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("language-");
            if (!isBlock) {
              return (
                <code className="bg-muted text-secondary px-1.5 py-0.5 text-sm" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            if (child && typeof child === "object" && "props" in child) {
              const childProps = child.props as {
                className?: string;
                children?: unknown;
                "data-meta"?: string;
              };
              const className = childProps.className ?? "";
              const language = className.match(/language-([\w-]+)/)?.[1] ?? "text";
              const rawChildren = childProps.children;
              const code =
                typeof rawChildren === "string"
                  ? rawChildren
                  : Array.isArray(rawChildren)
                    ? rawChildren.filter((c): c is string => typeof c === "string").join("")
                    : "";
              const meta = childProps["data-meta"];
              return <CodeBlock code={code} language={language} meta={meta} />;
            }
            return (
              <pre className="border border-border overflow-x-auto text-sm font-mono p-4">
                {children}
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left p-2 border-b border-border text-foreground font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2 border-b border-border text-muted-foreground">{children}</td>
          ),
          hr: () => <hr className="border-border my-8" />,
          img: ({ src, alt }) => (
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt ?? ""}
              loading="lazy"
              decoding="async"
              className="mx-auto"
            />
          ),
        }}
      >
        {body}
      </Markdown>
    </div>
  );
}
