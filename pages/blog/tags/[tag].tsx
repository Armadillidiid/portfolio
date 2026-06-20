import { PostList } from "@/components/blog/post-list";
import type { PostSummary } from "@/lib/posts";

type Props = {
  tag: string;
  posts: PostSummary[];
};

export default function TaggedPostsPage({ tag, posts }: Props) {
  return <PostList tag={tag} posts={posts} />;
}
