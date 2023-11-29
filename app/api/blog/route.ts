import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

// CREATE BLOG
export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    // create a new blog entry
    const createdBlog = await prisma.blog.create({
      data: {
        title: req.title,
        path: "",
      },
    });

    // write the content to a new file
    const filePath = path.join(process.cwd(), "blogs", `${createdBlog.id}.txt`);
    await fs.writeFile(filePath, req.content);

    // Update the blog entry with the correct path
    const updatedBlog = await prisma.blog.update({
      where: { id: createdBlog.id },
      data: { path: String(createdBlog.id) },
    });

    // send response
    return NextResponse.json(
      { message: "Blog created successfully", blog: createdBlog },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// READ BLOG
export async function GET() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
  const content: Array<object> = await Promise.all(
    blogs.map(async (blog) => {
      const filePath = path.join(
        process.cwd(),
        "blogs",
        `${blog.id.toString()}.txt`
      );
      const fileData: string = await fs.readFile(filePath, "utf-8");
      return { blogIdContent: blog.id, fileContent: fileData };
    })
  );

  const combinedData = [...blogs, ...content];
  console.log(combinedData);

  return NextResponse.json({ blogs: blogs, fileC: content }, { status: 200 });
}
