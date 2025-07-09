'use client';

import React, { useState, useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

// Define types for our blog post
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
  featuredImage?: string;
  createdAt: string;
}

// Define types for Instagram gallery item
interface GalleryItem {
  _id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  type: 'image' | 'video';
  isCarousel: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Define form data type
interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
  featuredImage: string;
  createdAt: string;
}

// Define gallery form data type
interface GalleryFormData {
  imageUrl: string;
  caption: string;
  likes: number;
  type: 'image' | 'video';
  isCarousel: boolean;
  isActive: boolean;
  sortOrder: number;
}

export default function Management() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'blog' | 'gallery'>('blog');
  const [showEditor, setShowEditor] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featuredImage: '',
    createdAt: ''
  });
  const [galleryFormData, setGalleryFormData] = useState<GalleryFormData>({
    imageUrl: '',
    caption: '',
    likes: 0,
    type: 'image',
    isCarousel: false,
    isActive: true,
    sortOrder: 1
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token === 'logged-in') {
      setIsLoggedIn(true);
      loadPosts();
      loadGalleryItems();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple hardcoded check
    if (username === 'admin' && password === 'greenbritain2024') {
      localStorage.setItem('admin-token', 'logged-in');
      setIsLoggedIn(true);
      loadPosts();
      loadGalleryItems();
    } else {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      
      // Ensure we always have an array
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
      setPosts([]);
    }
  };

  const loadGalleryItems = async () => {
    try {
      const response = await fetch('/api/instagram-gallery');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setGalleryItems(data);
      } else {
        setGalleryItems([]);
      }
    } catch (err) {
      console.error('Failed to load gallery items:', err);
      setGalleryItems([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsLoggedIn(false);
    setPosts([]);
    setGalleryItems([]);
    setUsername('');
    setPassword('');
    setShowEditor(false);
    setShowGalleryForm(false);
    setEditingPost(null);
    setEditingGalleryItem(null);
    setActiveTab('blog');
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'draft',
      featuredImage: '',
      createdAt: ''
    });
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      status: post.status || 'draft',
      featuredImage: post.featuredImage || '',
      createdAt: post.createdAt || ''
    });
    setShowEditor(true);
  };

  const handleDeletePost = async (post: BlogPost) => {
    if (confirm(`Are you sure you want to delete "${post.title || 'Untitled'}"?`)) {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/posts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: post._id }),
        });

        if (response.ok) {
          // Reload posts to get updated list from database
          await loadPosts();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSavePost = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setLoading(true);

      // Generate slug from title if empty
      let slug = formData.slug.trim();
      if (!slug) {
        slug = formData.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      const postData = {
        title: formData.title.trim(),
        slug: slug,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        status: formData.status,
        featuredImage: formData.featuredImage,
        createdAt: formData.createdAt || new Date().toISOString(),
      };

      let response;
      if (editingPost) {
        // Update existing post
        response = await fetch('/api/blog/posts', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...postData, _id: editingPost._id }),
        });
      } else {
        // Create new post
        response = await fetch('/api/blog/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      }

      if (response.ok) {
        // Close editor and reload posts
        setShowEditor(false);
        setEditingPost(null);
        await loadPosts();
      } else {
        const errorData = await response.json();
        alert(`Failed to save post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  // Gallery management functions
  const handleNewGalleryItem = () => {
    setEditingGalleryItem(null);
    setGalleryFormData({
      imageUrl: '',
      caption: '',
      likes: 0,
      type: 'image',
      isCarousel: false,
      isActive: true,
      sortOrder: galleryItems.length + 1
    });
    setShowGalleryForm(true);
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryFormData({
      imageUrl: item.imageUrl,
      caption: item.caption,
      likes: item.likes,
      type: item.type,
      isCarousel: item.isCarousel,
      isActive: item.isActive,
      sortOrder: item.sortOrder
    });
    setShowGalleryForm(true);
  };

  const handleDeleteGalleryItem = async (item: GalleryItem) => {
    if (confirm(`Are you sure you want to delete this gallery item?`)) {
      try {
        setLoading(true);
        const response = await fetch(`/api/instagram-gallery?id=${item._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadGalleryItems();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete gallery item: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        alert('Failed to delete gallery item. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveGalleryItem = async () => {
    if (!galleryFormData.imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    try {
      setLoading(true);

      const itemData = {
        imageUrl: galleryFormData.imageUrl.trim(),
        caption: galleryFormData.caption.trim(),
        likes: galleryFormData.likes,
        type: galleryFormData.type,
        isCarousel: galleryFormData.isCarousel,
        isActive: galleryFormData.isActive,
        sortOrder: galleryFormData.sortOrder
      };

      let response;
      if (editingGalleryItem) {
        // Update existing item
        response = await fetch('/api/instagram-gallery', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...itemData, id: editingGalleryItem._id }),
        });
      } else {
        // Create new item
        response = await fetch('/api/instagram-gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
      }

      if (response.ok) {
        await loadGalleryItems();
        setShowGalleryForm(false);
        setEditingGalleryItem(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to save gallery item: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelGalleryEdit = () => {
    setShowGalleryForm(false);
    setEditingGalleryItem(null);
  };

  const countPosts = () => {
    const total = posts.length;
    const published = posts.filter(post => post.status === 'published').length;
    const drafts = posts.filter(post => post.status === 'draft').length;
    return { total, published, drafts };
  };

  const countGalleryItems = () => {
    const total = galleryItems.length;
    const active = galleryItems.filter(item => item.isActive).length;
    const inactive = galleryItems.filter(item => !item.isActive).length;
    return { total, active, inactive };
  };

  const stats = countPosts();
  const galleryStats = countGalleryItems();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4 md:p-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔐
            </div>
            <h1 className="text-white mb-2 text-xl md:text-2xl lg:text-3xl font-bold">Content Management</h1>
            <p className="text-green-300">GreenBritain.Club Blog Administration</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <a href="/" className="text-green-400 hover:text-green-300 text-sm">
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-8 border border-green-400/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePost}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none"
                    placeholder="Enter post title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none"
                    placeholder="leave-blank-for-auto-generation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none h-24 resize-none"
                    placeholder="Brief description of the post"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
                    className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                
                <ImageUploader
                  value={formData.featuredImage}
                  onChange={(url: string) => setFormData({...formData, featuredImage: url})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Content
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content: string) => setFormData({...formData, content})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-white mb-2 text-xl md:text-2xl lg:text-3xl font-bold">Content Management</h1>
            <p className="text-green-300">Manage your cannabis blog posts and content</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleNewPost}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              + New Post
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-green-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-lg">
                📝
              </div>
              <div>
                <p className="text-green-300 text-sm mb-1">Total Posts</p>
                <p className="text-white text-xl md:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-blue-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg">
                ✅
              </div>
              <div>
                <p className="text-green-300 text-sm mb-1">Published</p>
                <p className="text-white text-xl md:text-2xl font-bold">{stats.published}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-yellow-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center text-lg">
                📄
              </div>
              <div>
                <p className="text-green-300 text-sm mb-1">Drafts</p>
                <p className="text-white text-xl md:text-2xl font-bold">{stats.drafts}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Posts List */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-8 border border-green-400/30">
          <h2 className="text-white mb-5 text-lg md:text-xl lg:text-2xl font-bold">Your Blog Posts</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📝
              </div>
              <p className="text-green-300 text-lg mb-3">No blog posts yet</p>
              <p className="text-green-400/80 mb-6">Start creating amazing cannabis content for your community!</p>
              <button
                onClick={handleNewPost}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4 md:p-6 border border-green-400/20 hover:border-green-400/40 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {post.featuredImage && (
                      <div className="lg:w-48 lg:flex-shrink-0">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-32 lg:h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <h3 className="text-white text-lg md:text-xl font-semibold truncate">
                              {post.title || 'Untitled'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${
                              post.status === 'published'
                                ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                                : 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30'
                            }`}>
                              {post.status}
                            </span>
                          </div>
                          <p className="text-green-300 text-sm mb-1">
                            /{post.slug || 'no-slug'}
                          </p>
                          <p className="text-green-400/80 text-sm mb-2 line-clamp-2">
                            {post.excerpt || 'No excerpt available'}
                          </p>
                          <p className="text-green-500 text-xs">
                            {new Date(post.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 self-start">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors min-w-[64px]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors min-w-[64px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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