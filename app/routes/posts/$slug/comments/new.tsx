import { ActionFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createComment } from "~/models/comment.server";
import { getUserId } from "~/session.server";
type ActionData =
  | {
      comment: null | string;
      slug: null | string;
    }
  | undefined;
const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData(); // go to the mdn docs
  const comment = formData.get("comment");
  const { slug } = params;
  console.log("1111111111");
  const errors: ActionData = {
    comment:
      (comment || comment?.length) ?? 0 > 0 ? null : "Comment is required",
    slug: slug ? null : "Slug is required",
  };
  console.log("------", errors);
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors); // json response of errors, retrieved in the componentin useActionData
  }
  invariant(typeof comment === "string", "comment must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  console.log("1111111111");
  const userId = await getUserId(request);

  if (userId !== undefined) {
    await createComment({ comment, userId, slug });
  }
  return redirect(`posts/${slug}/comments`);
};
export default function NewCommentRoute() {
  const errors = useActionData() as ActionData;
  return (
    <Form method="post" key={"new"}>
      {errors?.comment ? (
        <em className="text-red-600">{errors.comment}</em>
      ) : null}
      <input type="text" name="comment" className={inputClassName} />
    </Form>
  );
}
