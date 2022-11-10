import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import { marked } from "marked"; // done on the server, not sending a huge library to the frontend
import invariant from "tiny-invariant";
import { deleteComment, getCommentsBySlug } from "~/models/comment.server";

type LoaderData = {
  comments: Awaited<ReturnType<typeof getCommentsBySlug>>;
};

export const loader: LoaderFunction = async ({ params, ...rest }) => {
  const { slug } = params;
  invariant(slug, "slug is required");
  // load comments
  const comments = (await getCommentsBySlug(slug)) ?? [];
  return json<LoaderData>({ comments });
};
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData(); // go to the mdn docs
  const id = formData.get("delete");
  invariant(typeof id === "string", "id must be a string");
  const userId = await deleteComment(id);

  return redirect(`posts/${params.slug}/comments`);
};
export default function CommentsSlugRoute() {
  const { comments } = useLoaderData<LoaderData>();
  return (
    <div>
      <Link to="new" className="ml-4 text-blue-600">
        New Comment
      </Link>
      <Outlet />
      <ol>
        {comments.map((c) => (
          <li key={c.id}>
            <div className="flex justify-between">
              <span>{c.comment}</span>
              <span className="flex">
                <span>
                  <em>{c.user.email}</em>
                </span>
                <Form method="post">
                  <button
                    type="submit"
                    name="delete"
                    value={c.id}
                    className="text-100 rounded px-4 text-red-500 hover:bg-blue-500 active:bg-blue-600"
                  >
                    X
                  </button>
                </Form>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
