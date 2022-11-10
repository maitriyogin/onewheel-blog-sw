import { prisma } from "~/db.server";
import type { Comment } from "@prisma/client";
export type { Comment } from "@prisma/client";

export async function getCommentsBySlug(slug: string) {
  return prisma.comment.findMany({ where: { slug }, include: { user: true } });
}

export async function getCommentsByUser(userId: string) {
  return prisma.comment.findMany({
    where: { userId },
    include: { user: true },
  });
}

export async function getComments(userId: string, slug: string) {
  return prisma.comment.findMany({ where: { userId, slug } });
}

export async function getComment(id: string) {
  return prisma.comment.findUnique({ where: { id } });
}

export async function createComment(
  comment: Pick<Comment, "userId" | "comment" | "slug">
) {
  return prisma.comment.create({ data: comment });
}

export async function updateComment(
  slug: string,
  comment: Pick<Comment, "id" | "userId" | "comment" | "slug">
) {
  return prisma.comment.update({ data: comment, where: { id: comment.id } });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}
