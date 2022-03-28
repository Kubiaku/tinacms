import { Post } from "../../components/post";
import { ExperimentalGetTinaClient } from "../../.tina/__generated__/types";

// Use the props returned by get static props
export default function BlogPostPage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
) {
  if (props.data && props.data.posts) {
    return <Post {...props.data.posts} />;
  }
  return <div>No data</div>;
}

export const getStaticProps = async ({ params }) => {
  const client = ExperimentalGetTinaClient();
  const tinaProps = await client.BlogPostQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
    },
  };
};

/**
 * To build the blog post pages we just iterate through the list of
 * posts and provide their "filename" as part of the URL path
 *
 * So a blog post at "content/posts/hello.md" would
 * be viewable at http://localhost:3000/posts/hello
 */
export const getStaticPaths = async () => {
  const client = ExperimentalGetTinaClient();
  const postsListData = await client.postsConnection();
  console.log(postsListData);
  return {
    paths: postsListData.data.postsConnection.edges.map((post) => ({
      params: { filename: post.node.sys.filename },
    })),
    fallback: true,
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
