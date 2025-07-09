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

export default function Management() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featuredImage: '',
    createdAt: ''
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token === 'logged-in') {
      setIsLoggedIn(true);
      loadPosts();
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

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsLoggedIn(false);
    setPosts([]);
    setUsername('');
    setPassword('');
    setShowEditor(false);
    setEditingPost(null);
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
        // Reload posts to get updated list from database
        await loadPosts();
        setShowEditor(false);
        setEditingPost(null);
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

  // Count posts manually (no array methods)
  const countPosts = () => {
    let total = 0;
    let published = 0;
    let drafts = 0;

    if (posts && posts.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        if (posts[i]) {
          total++;
          if (posts[i].status === 'published') published++;
          if (posts[i].status === 'draft') drafts++;
        }
      }
    }

    return { total, published, drafts };
  };

  const stats = countPosts();

  // Login Form
  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #065f46, #047857, #059669)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#22c55e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              🔐
            </div>
            <h1 style={{ color: 'white', margin: '0 0 10px', fontSize: '28px' }}>Content Management</h1>
            <p style={{ color: '#86efac', margin: 0 }}>GreenBritain.Club Blog Administration</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#fca5a5',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Enter username..."
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Enter password..."
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: loading ? '#16a34a' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Logging in...
                </>
              ) : (
                <>
                  🌿 Access Management Panel
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/" style={{ color: '#22c55e', textDecoration: 'none' }}>
              ← Back to GreenBritain.Club
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Post Editor
  if (showEditor) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #065f46, #047857, #059669)', 
        padding: '20px'
      }}>
        <div className="max-w-4xl mx-auto px-4">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px'
          }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '28px' }}>
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSavePost}
                style={{
                  padding: '10px 20px',
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                💾 Save Post
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                  Post Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Enter an engaging post title..."
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                  URL Slug (SEO-friendly URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="will-be-auto-generated-from-title"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="draft">Draft (Not Public)</option>
                  <option value="published">Published (Live on Site)</option>
                </select>
              </div>

              {/* Publication Date */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  color: '#22c55e', 
                  marginBottom: '8px', 
                  fontWeight: 'bold' 
                }}>
                  Publication Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.createdAt ? new Date(formData.createdAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value ? new Date(e.target.value).toISOString() : '';
                    setFormData({...formData, createdAt: dateValue});
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Image Uploader */}
              <div>
                <ImageUploader 
                  value={formData.featuredImage} 
                  onChange={(url: string) => setFormData({...formData, featuredImage: url})} 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                  Post Excerpt (Summary)
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  placeholder="Write a brief, engaging summary of your cannabis blog post..."
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                  Full Content
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value: string) => setFormData({...formData, content: value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #065f46, #047857, #059669)', 
      padding: '20px'
    }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ color: 'white', margin: '0 0 10px', fontSize: '32px' }}>Content Management</h1>
            <p style={{ color: '#86efac', margin: 0 }}>Manage your cannabis blog posts and content</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleNewPost}
              style={{
                padding: '12px 24px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✏️ Create New Post
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#22c55e',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📝
              </div>
              <div>
                <p style={{ color: '#86efac', margin: '0 0 5px', fontSize: '14px' }}>Total Posts</p>
                <p style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🌐
              </div>
              <div>
                <p style={{ color: '#86efac', margin: '0 0 5px', fontSize: '14px' }}>Published</p>
                <p style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.published}</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#eab308',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📄
              </div>
              <div>
                <p style={{ color: '#86efac', margin: '0 0 5px', fontSize: '14px' }}>Drafts</p>
                <p style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.drafts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <h2 style={{ color: 'white', margin: '0 0 20px', fontSize: '24px' }}>Your Blog Posts</h2>
          
          {!posts || posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '32px'
              }}>
                🌿
              </div>
              <p style={{ color: '#86efac', margin: '0 0 15px', fontSize: '18px' }}>No blog posts yet</p>
              <p style={{ color: '#86efac', margin: '0 0 20px' }}>Start creating amazing cannabis content for your community!</p>
              <button
                onClick={handleNewPost}
                style={{
                  padding: '12px 24px',
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✏️ Write Your First Post
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {posts.map((post, index) => (
                <div key={index} style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  display: 'flex',
                  gap: '20px'
                }}>
                  {post.featuredImage && (
                    <div style={{ 
                      width: '120px',
                      height: '80px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      <img 
                        src={post.featuredImage} 
                        alt={post.title || 'Blog post'} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                          <h3 style={{ color: 'white', margin: 0, fontSize: '20px' }}>
                            {post.title || 'Untitled Post'}
                          </h3>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: post.status === 'published' ? '#22c55e' : '#eab308',
                            color: 'white'
                          }}>
                            {post.status === 'published' ? '🌐 LIVE' : '📝 DRAFT'}
                          </span>
                        </div>
                        <p style={{ color: '#86efac', margin: '0 0 5px', fontSize: '14px' }}>
                          URL: /{post.slug || 'no-slug-set'}
                        </p>
                        <p style={{ color: '#86efac', margin: '0 0 10px' }}>
                          {post.excerpt || 'No excerpt provided'}
                        </p>
                        <p style={{ color: '#22c55e', margin: 0, fontSize: '14px' }}>
                          Created: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleEditPost(post)}
                          style={{
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post)}
                          style={{
                            padding: '8px 16px',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 