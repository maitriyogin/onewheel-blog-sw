import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "stephen.white@mac.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("guyfawks", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  const user1 = await prisma.user.upsert({
    where: { email: "gumball@fantasy.com" },
    update: {
      email: "gumball@fantasy.com",
      password: {
        update: {
          hash: await bcrypt.hash("darwin2000", 10),
        },
      },
    },
    create: {
      email: "gumball@fantasy.com",
      password: {
        create: {
          hash: await bcrypt.hash("darwin2000", 10),
        },
      },
    },
  });
  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post!",
      markdown: "##### My First post!!",
    },
    {
      slug: "trail-riding-with-onewheel",
      title: "Trail Riding with Onewheel",
      markdown: "##### Trail Riding",
      stars: 5,
    },
  ];
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  // comments
  const comments = [
    {
      id: "1",
      comment: "This post is just the best!",
      slug: "trail-riding-with-onewheel",
      userId: user.id,
    },
    {
      id: "2",
      comment: "This blog was amazing!",
      slug: "my-first-post",
      userId: user.id,
    },
    {
      id: "3",
      comment: "Fantasy blog",
      slug: "my-first-post",
      userId: user1.id,
    },
  ];
  for (const comment of comments) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: comment,
      create: comment,
    });
  }
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
