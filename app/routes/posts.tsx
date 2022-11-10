import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/server-runtime";
import { getPostListings } from "~/models/post.server";
import { getUser, requireUserId } from "~/session.server";
import { useOptionalAdminUser } from "~/utils";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  posts: Awaited<ReturnType<typeof getPostListings>>;
};
export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const posts = await getPostListings();
  console.log("-------- USER", user, posts);
  return json({ user, posts });
}

export default function PostsRoute() {
  const { user, posts } = useLoaderData<LoaderData>();
  const adminUser = useOptionalAdminUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Posts</Link>
        </h1>
        <p>{user?.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new/edit" className="block p-4 text-xl text-blue-500">
            + New Post
          </Link>

          <hr />
          <div className="p-4">
            {posts.length === 0 ? (
              <p className="p-4">No posts yet</p>
            ) : (
              <ol>
                {posts?.map((p) => (
                  <>
                    <li key={p.slug}>
                      <Link
                        to={p.slug}
                        prefetch="intent" // this prefetch the page and that data when hovering over that link
                        className="text-blue-600 "
                      >
                        {p.title}
                      </Link>
                    </li>
                    <hr />
                  </>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
// to catch unexpected errors
export function ErrorBoundary({ error }: { error: unknown }) {
  if (error instanceof Error) {
    return (
      <div className="text-red-500">
        Oh no, something went wrong!
        <pre>{error.message}</pre>
      </div>
    );
  }
  return <div className="text-red-500">Oh no, something went wrong!</div>;
}
