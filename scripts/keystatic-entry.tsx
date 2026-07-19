import { createRoot } from "react-dom/client";
import { Keystatic } from "@keystatic/core/ui";
import type { Config } from "@keystatic/core";
import cfg from "../keystatic.config";

const config = cfg as Config<any, any>;

const root = createRoot(document.getElementById("root")!);
root.render(<Keystatic config={config} />);
