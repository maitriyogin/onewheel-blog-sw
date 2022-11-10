import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import { marked } from "marked"; // done on the server, not sending a huge library to the frontend
import invariant from "tiny-invariant";
import { getCommentsBySlug } from "~/models/comment.server";

type LoaderData = {
  title: string;
  html: string;
  slug: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "slug is required");
  const post = await getPost(slug);
  invariant(post, `post not found ${slug}`);
  const html = marked(post?.markdown);
  return json<LoaderData>({ slug, title: post?.title, html });
};

const useIsActive = (routeItem: string) => {
  const ms = useMatches();
  return {
    isActive: ms ? ms[ms.length - 1].id.includes(routeItem) : false,
    previousRoute: ms[ms.length - 2 >= 1 ? ms.length - 2 : 1],
  };
};
export default function PostRoute() {
  const { title, html, slug } = useLoaderData() as LoaderData;
  const { isActive, previousRoute } = useIsActive("comments");
  return (
    <div className="flex-col content-between space-y-4">
      <div className="flex-col ">
        <h3 className="text-2xl font-bold">
          {title}

          <Link to={"edit"} className="ml-4 text-blue-600 ">
            Edit Post
          </Link>
        </h3>
        <hr className="my-4" />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="flex-col rounded-sm bg-slate-50">
        {isActive ? (
          <Link to={previousRoute} className="text-blue-600 ">
            Hide Comments
          </Link>
        ) : (
          <Link to="comments" className="text-blue-600 ">
            Show Comments
          </Link>
        )}
        <Outlet />
      </div>
    </div>
  );
}
