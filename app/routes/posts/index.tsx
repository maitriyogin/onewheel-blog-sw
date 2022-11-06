import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime/dist/router";
import { getPostListings } from "~/models/post.server";
import { useOptionalAdminUser, useOptionalUser } from "~/utils";
type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};
export const loader: LoaderFunction = async () =>
  json({ posts: await getPostListings() });

export default function PostsRoute() {
  const { posts } = useLoaderData() as LoaderData;
  const adminUser = useOptionalAdminUser();
  return (
    <main>
      <h1>Posts</h1>
      {adminUser ? (
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      ) : null}
      {posts.map((p) => (
        <li key={p.slug}>
          <Link
            to={p.slug}
            prefetch="intent" // this prefetch the page and that data when hovering over that link
            className="text-blue-600 underline"
          >
            {p.title}
          </Link>
        </li>
      ))}
    </main>
  );
}
