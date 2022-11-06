import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import { marked } from "marked"; // done on the server, not sending a huge library to the frontend
import invariant from "tiny-invariant";

type LoaderData = {
  title: string;
  html: string;
};
export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "slug is required");
  const post = await getPost(slug);
  invariant(post, `post not found ${slug}`);
  const html = marked(post?.markdown);
  return json<LoaderData>({ title: post?.title, html });
};
export default function PostRoute() {
  const { title, html } = useLoaderData();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="test-3xl my-6 border-b-2 text-center">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
