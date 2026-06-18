export const SITE = {
  name: "Emmanuel Isenah",
  shortName: "emmanuel",
  description: "Personal site — TypeScript, React, and the web.",
  url: import.meta.env.VITE_SITE_URL ?? "http://localhost:5173",
  defaultOgImage: `${import.meta.env.VITE_SITE_URL ?? "http://localhost:5173"}/og/default.png`,
  locale: "en_US",
  author: {
    name: "Emmanuel Isenah",
    email: "emmanuel@isenah.example.com",
  },
  social: {
    github: "https://github.com/Armadillidiid",
    linkedin: "https://www.linkedin.com/in/emmanuel-isenah-541593190",
    x: "https://x.com/EIsenah",
  },
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = SITE.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
