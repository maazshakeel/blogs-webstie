// pages/index.js

"use client";

import BlogCard from "@/components/BlogCard";
// pages/index.js

import { useState, useEffect } from "react";

const BlogInterface = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [updatedBlogTitle, setUpdatedBlogTitle] = useState("");
  const [updatedBlogContent, setUpdateBlogContent] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const response = await fetch("/api/blog");
    const data = await response.json();
    setBlogs(data);
    setIsLoading(false);
  };

  const handleCreateBlog = async () => {
    const response = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newBlogTitle,
        content: newBlogContent,
      }),
    });

    if (response.ok) {
      setNewBlogTitle("");
      setNewBlogContent("");
      fetchBlogs();
    }
  };

  const handleDeleteBlog = async (id) => {
    const response = await fetch(`/api/blog/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchBlogs();
    }
  };

  const handleUpdateBlog = async () => {
    const response = await fetch(`/api/blog/${selectedBlogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedBlogTitle,
        content: updatedBlogContent,
      }),
    });

    if (response.ok) {
      setNewBlogTitle("");
      setNewBlogContent("");
      setSelectedBlogId(null);
      fetchBlogs();
    }
  };

  const handleSee = (id: any) => {
    // console.log(blogs.fileC);
    blogs.fileC.map((s) => {
      console.log(s);
      if (s.blogIdContent === id) {
        alert(s.fileContent);
      }
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="bg-slate-950 h-screen w-screen text-white">
      <nav className="flex">
        <h1 className="pt-5 pl-3 font-bold  text-3xl">Maaz</h1>
      </nav>
      <div></div>
    </div>
  );
};

export default BlogInterface;
