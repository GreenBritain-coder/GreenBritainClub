"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: string;
  excerpt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-green-300">Manage your cannabis blog content</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/blog/editor"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <span></span>
              <span>New Post</span>
            </Link>
            <Link 
              href="/blog"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Blog
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl"></span>
              </div>
              <div>
                <p className="text-green-300 text-sm">Total Posts</p>
                <p className="text-white text-2xl font-bold">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl"></span>
              </div>
              <div>
                <p className="text-green-300 text-sm">Published</p>
                <p className="text-white text-2xl font-bold">
                  {posts.filter(post => post.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl"></span>
              </div>
              <div>
                <p className="text-green-300 text-sm">Drafts</p>
                <p className="text-white text-2xl font-bold">
                  {posts.filter(post => post.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-green-400/20">
          <h2 className="text-2xl font-bold text-white mb-6">Blog Posts</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-4xl"></span>
              </div>
              <p className="text-green-200 text-lg mb-4">No posts found</p>
              <p className="text-green-300 mb-6">Create your first cannabis blog post!</p>
              <Link 
                href="/blog/editor"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span></span>
                <span>Create First Post</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-black/30 rounded-lg p-6 border border-green-400/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">{post.title}</h3>
                      <p className="text-green-300 text-sm">/{post.slug}</p>
                      <p className="text-green-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        post.status === 'published' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {post.status}
                      </span>
                      <Link
                        href={`/blog/editor/${post._id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
