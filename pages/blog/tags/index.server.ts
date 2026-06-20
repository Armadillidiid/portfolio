import { defineHead, defineHandler } from "void";
import { getAllTags } from "@/lib/posts";

export const loader = defineHandler(() => ({
  tags: getAllTags(),
}));

export const head = defineHead(() => ({
  title: "Tags",
  meta: [
    {
      name: "description",
      content: "All tags across published posts on the blog.",
    },
  ],
}));
