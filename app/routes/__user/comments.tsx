import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { getCommentsBySlug, getCommentsByUser } from "~/models/comment.server";
import { getUserId } from "~/session.server";

type LoaderData = {
  comments: Awaited<ReturnType<typeof getCommentsBySlug>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const comments = userId ? await getCommentsByUser(userId) : [];
  return json<LoaderData>({ comments });
};

export default function UserCommentsRoute() {
  const { comments } = useLoaderData<LoaderData>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="test-3xl my-6 border-b-2 text-center">
        User Comments - {ENV.ADMIN_EMAIL}
      </h1>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <div>
              {}
              {c.comment}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
