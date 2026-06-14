import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(256),
      slug: s.path(),
      date: s.isodate(),
      draft: s.boolean().default(false),
      tags: s.array(s.string()).default([]),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, url: `/blog/${data.slug}` })),
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
