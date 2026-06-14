import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/*.{md,mdx}",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.path(),
      date: s.isodate(),
      draft: s.boolean().default(false),
      tags: s.array(s.string()).default([]),
      cover: s.string().optional(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^posts\//, ""),
      url: `/blog/${data.slug.replace(/^posts\//, "")}`,
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    gfm: true,
  },
});
