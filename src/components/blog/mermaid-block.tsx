import { useEffect, useId, useState } from "react";
import { useThemeMode } from "@/components/theme-provider";

type MermaidBlockProps = {
  code: string;
};

function Fallback({ code }: MermaidBlockProps) {
  return (
    <pre className="border border-border overflow-x-auto text-sm font-mono p-4">
      <code>{code}</code>
    </pre>
  );
}

export function MermaidBlock({ code }: MermaidBlockProps) {
  const { mode } = useThemeMode();
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const reactId = useId();
  const renderId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    void (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: mode === "dark" ? "dark" : "default",
          fontFamily: "inherit",
        });
        const { svg: rendered } = await mermaid.render(renderId, code);
        if (!cancelled) setSvg(rendered);
      } catch (error) {
        console.error("[mermaid] render failed:", error);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, mode, renderId]);

  if (failed || !svg) return <Fallback code={code} />;

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
