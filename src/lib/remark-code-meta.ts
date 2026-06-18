type CodeNode = {
  type: "code";
  lang?: string | null;
  meta?: string | null;
  data?: {
    hProperties?: Record<string, unknown>;
    [k: string]: unknown;
  };
  [k: string]: unknown;
};

type Parent = { type: string; children?: unknown[] };

function walk(node: unknown, visit: (n: CodeNode) => void): void {
  if (!node || typeof node !== "object") return;
  const n = node as CodeNode & Parent;
  if (n.type === "code") visit(n);
  if (Array.isArray(n.children)) {
    for (const child of n.children) walk(child, visit);
  }
}

export function remarkCodeMeta() {
  return (tree: unknown) => {
    walk(tree, (node) => {
      if (node.meta) {
        node.data ??= {};
        node.data.hProperties ??= {};
        const props = node.data.hProperties as Record<string, unknown>;
        if (props.dataMeta === undefined) {
          props.dataMeta = node.meta;
        }
      }
    });
  };
}
