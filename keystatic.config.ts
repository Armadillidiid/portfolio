import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.datetime({
          label: "Date",
          validation: { isRequired: true },
        }),
        draft: fields.checkbox({ label: "Draft", defaultValue: false }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value ?? "Tag",
        }),
        cover: fields.text({
          label: "Cover image",
          description: "Path relative to content/posts/, e.g. covers/image.png",
        }),
        content: fields.markdoc({
          label: "Content",
        }),
      },
    }),
  },
});
