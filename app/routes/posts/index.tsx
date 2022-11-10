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
      <h1>Please select a post</h1>
    </main>
  );
}
