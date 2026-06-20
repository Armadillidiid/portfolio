import { PostList } from "@/components/blog/post-list";
import type { PostSummary } from "@/lib/posts";

type Props = {
  posts: PostSummary[];
};

export default function BlogIndexPage({ posts }: Props) {
  return <PostList posts={posts} />;
}
