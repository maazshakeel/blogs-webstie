// Assuming this is inside pages/api/blog/[id].ts or similar

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Retrieve the blog entry from the database
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete the associated file
    const filePath = path.join(process.cwd(), "blogs", `${blog.id}.txt`);
    await fs.unlink(filePath);

    // Delete the blog entry from the database
    await prisma.blog.delete({
      where: {
        id: blog.id,
      },
    });

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE BLOG
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const req = await request.json();
    const blogId = parseInt(params.id);

    const { title, content } = req;

    // Retrieve the blog entry from the database
    const existingBlog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Update the associated file with new content
    const filePath = path.join(
      process.cwd(),
      "blogs",
      `${existingBlog.id}.txt`
    );
    await fs.writeFile(filePath, content);

    // Update the blog entry in the database
    const updatedBlog = await prisma.blog.update({
      where: {
        id: existingBlog.id,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(
      { message: "Blog updated successfully", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
