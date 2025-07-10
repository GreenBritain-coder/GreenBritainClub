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
  isActive: boolean;
  sortOrder: number;
}

// Define user interface
interface User {
  email: string;
  role: 'admin' | 'user';
  name: string;
  firstName?: string;
  lastName?: string;
  tier?: string;
  subscription?: {
    tier: string;
    price: number;
    status: string;
    startDate: string;
  };
}

export default function Management() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'blog' | 'gallery' | 'payments' | 'users' | 'profile' | 'membership'>('membership');
  const [showEditor, setShowEditor] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  
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
    isActive: true,
    sortOrder: 1
  });

  // Payment management state
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState<any>({});
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  
  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>({});
  const [userFilter, setUserFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userAction, setUserAction] = useState<string>('');

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user-data');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setIsLoggedIn(true);
      
      if (user.role === 'admin') {
        setActiveTab('blog');
        loadPosts();
        loadGalleryItems();
      } else {
        setActiveTab('membership');
        loadUserProfile(token);
      }
    }
  }, []);

  // Load payments when filter changes
  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin' && activeTab === 'payments') {
      loadPayments();
    }
  }, [paymentFilter, isLoggedIn, user?.role, activeTab]);

  // Load users when filter changes
  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin' && activeTab === 'users') {
      loadUsers();
    }
  }, [userFilter, isLoggedIn, user?.role, activeTab]);

  const loadUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const profile = await response.json();
        setProfileData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || ''
        });
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store authentication data
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user-data', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsLoggedIn(true);
      
      if (data.user.role === 'admin') {
        setActiveTab('blog');
        loadPosts();
        loadGalleryItems();
        loadPayments();
      } else {
        setActiveTab('membership');
        loadUserProfile(data.token);
      }
      
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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

  const loadPayments = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const url = paymentFilter === 'all' ? '/api/payments/manage' : `/api/payments/manage?status=${paymentFilter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
        
        // Process stats
        const stats = data.stats || [];
        const processedStats = {
          total: stats.reduce((sum: number, stat: any) => sum + stat.count, 0),
          pending: stats.find((s: any) => s._id === 'pending')?.count || 0,
          completed: stats.find((s: any) => s._id === 'completed')?.count || 0,
          confirming: stats.find((s: any) => s._id === 'confirming')?.count || 0,
          expired: stats.find((s: any) => s._id === 'expired')?.count || 0,
          cancelled: stats.find((s: any) => s._id === 'cancelled')?.count || 0
        };
        setPaymentStats(processedStats);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const url = userFilter === 'all' ? '/api/users/manage' : `/api/users/manage?status=${userFilter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setUserStats(data.stats || {});
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleUserAction = async (userId: string, action: string, subscriptionData?: any, notes?: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch('/api/users/manage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          action,
          subscriptionData,
          notes
        })
      });

      if (response.ok) {
        // Reload users to reflect changes
        await loadUsers();
        setShowUserModal(false);
        setSelectedUser(null);
        alert(`User subscription ${action.replace('_', ' ')}d successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to ${action.replace('_', ' ')} subscription: ${error.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user subscription:`, error);
      alert(`Failed to ${action.replace('_', ' ')} subscription`);
    }
  };

  const openUserModal = (user: any, action: string) => {
    setSelectedUser(user);
    setUserAction(action);
    setShowUserModal(true);
  };

  const getTierDisplayInfo = (tier: string) => {
    const tierInfo = getTierInfo(tier);
    return {
      name: tierInfo.name,
      price: tierInfo.price,
      color: tierInfo.color
    };
  };

  const handlePaymentAction = async (paymentId: string, action: string, transactionHash?: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch('/api/payments/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId,
          action,
          transactionHash,
          notes: `${action} by admin`
        })
      });

      if (response.ok) {
        // Reload payments to reflect changes
        await loadPayments();
        alert(`Payment ${action}ed successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to ${action} payment: ${error.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error);
      alert(`Failed to ${action} payment`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setIsLoggedIn(false);
    setUser(null);
    setPosts([]);
    setGalleryItems([]);
    setProfileData({ firstName: '', lastName: '' });
    setEmail('');
    setPassword('');
    setShowEditor(false);
    setShowGalleryForm(false);
    setEditingPost(null);
    setEditingGalleryItem(null);
    setActiveTab('membership');
  };

  const handleUpdateProfile = async () => {
    if (!profileData.firstName || !profileData.lastName) {
      setError('First name and last name are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update user data in localStorage
      if (user) {
        const updatedUser = { ...user, name: `${profileData.firstName} ${profileData.lastName}` };
        setUser(updatedUser);
        localStorage.setItem('user-data', JSON.stringify(updatedUser));
      }

      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      sapphire: {
        name: '🔷 Sapphire',
        price: 'Free',
        color: 'blue',
        benefits: [
          'Access to basic blog content',
          'Monthly newsletter',
          'Community forum access',
          'Limited discounts on products'
        ]
      },
      ruby: {
        name: '♦️ Ruby',
        price: '£10/month',
        color: 'red',
        benefits: [
          'All Sapphire benefits',
          'Exclusive content access',
          'Priority customer support',
          '10% discount on all products',
          'Monthly cannabis samples'
        ]
      },
      diamond: {
        name: '💎 Diamond',
        price: '£15.99/month',
        color: 'purple',
        benefits: [
          'All Ruby benefits',
          'VIP event invitations',
          'Early access to new products',
          '20% discount on all products',
          'Premium cannabis samples monthly',
          'Personal cannabis consultant'
        ]
      }
    };
    return tiers[tier as keyof typeof tiers] || tiers.sapphire;
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
    setImageInputMode('url'); // Reset to URL mode for new items
    setGalleryFormData({
      imageUrl: '',
      caption: '',
      likes: 0,
      type: 'image',
      isActive: true,
      sortOrder: galleryItems.length + 1
    });
    setShowGalleryForm(true);
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    // Set input mode based on image URL - if it's a local upload (static or API), use upload mode
    const isLocalUpload = item.imageUrl.startsWith('/uploads/') || item.imageUrl.startsWith('/api/uploads/');
    setImageInputMode(isLocalUpload ? 'upload' : 'url');
    setGalleryFormData({
      imageUrl: item.imageUrl,
      caption: item.caption,
      likes: item.likes,
      type: item.type,
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
    setImageInputMode('url'); // Reset to default mode
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
            <h1 className="text-white mb-2 text-xl md:text-2xl lg:text-3xl font-bold">Member Login</h1>
            <p className="text-green-300">Access your membership dashboard or admin panel</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none"
                  placeholder="Enter your email address"
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
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 md:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm md:text-base rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePost}
                  disabled={loading}
                  className="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white text-sm md:text-base rounded-lg font-medium transition-colors"
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

  if (showGalleryForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-8 border border-purple-400/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                {editingGalleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </h1>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCancelGalleryEdit}
                  className="px-3 md:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm md:text-base rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGalleryItem}
                  disabled={loading}
                  className="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white text-sm md:text-base rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Image Input Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Image Source
                </label>
                <div className="flex space-x-1 mb-4">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      imageInputMode === 'url'
                        ? 'bg-purple-600 text-white'
                        : 'bg-black/30 text-green-300 hover:bg-black/50'
                    }`}
                  >
                    🔗 URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      imageInputMode === 'upload'
                        ? 'bg-purple-600 text-white'
                        : 'bg-black/30 text-green-300 hover:bg-black/50'
                    }`}
                  >
                    📁 Upload
                  </button>
                </div>
              </div>

              {/* Image Input Section */}
              {imageInputMode === 'url' ? (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={galleryFormData.imageUrl}
                    onChange={(e) => setGalleryFormData({...galleryFormData, imageUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-purple-400 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              ) : (
                <div>
                  <ImageUploader
                    value={galleryFormData.imageUrl}
                    onChange={(url: string) => setGalleryFormData({...galleryFormData, imageUrl: url})}
                  />
                </div>
              )}
              
              {galleryFormData.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Preview
                  </label>
                  <div className="aspect-square w-48 mx-auto rounded-lg overflow-hidden border border-purple-400/30">
                    <img
                      src={galleryFormData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="12">Invalid URL</text></svg>';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Caption
                </label>
                <textarea
                  value={galleryFormData.caption}
                  onChange={(e) => setGalleryFormData({...galleryFormData, caption: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-purple-400 focus:outline-none h-20 resize-none"
                  placeholder="Add a caption for this image..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Likes Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={galleryFormData.likes}
                    onChange={(e) => setGalleryFormData({...galleryFormData, likes: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-purple-400 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={galleryFormData.sortOrder}
                    onChange={(e) => setGalleryFormData({...galleryFormData, sortOrder: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-purple-400 focus:outline-none"
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Media Type
                  </label>
                  <select
                    value={galleryFormData.type}
                    onChange={(e) => setGalleryFormData({...galleryFormData, type: e.target.value as 'image' | 'video'})}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Status
                  </label>
                  <select
                    value={galleryFormData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setGalleryFormData({...galleryFormData, isActive: e.target.value === 'active'})}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
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
            <h1 className="text-white mb-2 text-xl md:text-2xl lg:text-3xl font-bold">
              {user?.role === 'admin' ? 'Admin Dashboard' : `Welcome back, ${user?.name?.split(' ')[0] || 'Member'}!`}
            </h1>
            <p className="text-green-300">
              {user?.role === 'admin' 
                ? 'Manage your cannabis blog posts and gallery content' 
                : `Your ${getTierInfo(user?.tier || 'sapphire').name} membership dashboard`
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {user?.role === 'admin' && activeTab === 'blog' ? (
              <button
                onClick={handleNewPost}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                + New Post
              </button>
            ) : user?.role === 'admin' && activeTab === 'gallery' ? (
              <button
                onClick={handleNewGalleryItem}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                + New Gallery Item
              </button>
            ) : null}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {user?.role === 'admin' ? (
            <>
              <button
                onClick={() => setActiveTab('blog')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  activeTab === 'blog'
                    ? 'bg-green-600 text-white'
                    : 'bg-black/30 text-green-300 hover:bg-black/50'
                }`}
              >
                <span className="md:hidden">📝</span>
                <span className="hidden md:inline">📝 Blog Posts</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  activeTab === 'gallery'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/30 text-green-300 hover:bg-black/50'
                }`}
              >
                <span className="md:hidden">📸</span>
                <span className="hidden md:inline">📸 Gallery</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  activeTab === 'payments'
                    ? 'bg-orange-600 text-white'
                    : 'bg-black/30 text-green-300 hover:bg-black/50'
                }`}
              >
                <span className="md:hidden">💰</span>
                <span className="hidden md:inline">💰 Payments</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'bg-black/30 text-green-300 hover:bg-black/50'
                }`}
              >
                <span className="md:hidden">👥</span>
                <span className="hidden md:inline">👥 Users</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('membership')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  activeTab === 'membership'
                    ? 'bg-green-600 text-white'
                    : 'bg-black/30 text-green-300 hover:bg-black/50'
                }`}
              >
                <span className="md:hidden">🔷</span>
                <span className="hidden md:inline">🔷 My Membership</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'bg-black/30 text-green-300 hover:bg-black/50'
                }`}
              >
                <span className="md:hidden">👤</span>
                <span className="hidden md:inline">👤 Profile</span>
              </button>
            </>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {user?.role === 'admin' && activeTab === 'blog' ? (
            <>
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
            </>
          ) : user?.role === 'admin' && activeTab === 'gallery' ? (
            <>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-lg">
                    📸
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Total Items</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{galleryStats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-green-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-lg">
                    ✅
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Active</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{galleryStats.active}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-lg">
                    ⏸️
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Inactive</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{galleryStats.inactive}</p>
                  </div>
                </div>
              </div>
            </>
          ) : user?.role === 'admin' && activeTab === 'payments' ? (
            <>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-orange-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-lg">
                    💰
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Total Payments</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{paymentStats.total || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-green-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-lg">
                    ✅
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Completed</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{paymentStats.completed || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-yellow-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center text-lg">
                    ⏳
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Pending</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{paymentStats.pending || 0}</p>
                  </div>
                </div>
              </div>
            </>
          ) : user?.role === 'admin' && activeTab === 'users' ? (
            <>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-blue-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg">
                    👥
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Total Users</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{userStats.totalUsers || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-green-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-lg">
                    ✅
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Active Subscriptions</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{userStats.activeSubscriptions || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-lg">
                    💎
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Premium Members</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{(userStats.rubyUsers || 0) + (userStats.diamondUsers || 0)}</p>
                  </div>
                </div>
              </div>
            </>
          ) : user?.role === 'user' && activeTab === 'membership' ? (
            <>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-blue-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg">
                    {getTierInfo(user.tier || 'sapphire').name.split(' ')[0]}
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Membership Tier</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{getTierInfo(user.tier || 'sapphire').name.split(' ')[1]}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-green-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-lg">
                    💰
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Monthly Cost</p>
                    <p className="text-white text-xl md:text-2xl font-bold">{getTierInfo(user.tier || 'sapphire').price}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-lg">
                    ✅
                  </div>
                  <div>
                    <p className="text-green-300 text-sm mb-1">Status</p>
                    <p className="text-white text-xl md:text-2xl font-bold">Active</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        
        {/* Content List */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-8 border border-green-400/30">
          <h2 className="text-white mb-5 text-lg md:text-xl lg:text-2xl font-bold">
            {user?.role === 'admin' ? 
              (activeTab === 'blog' ? 'Your Blog Posts' : 
               activeTab === 'gallery' ? 'Gallery Items' :
               activeTab === 'payments' ? 'Payment Management' :
               activeTab === 'users' ? 'User Management' : 'Admin Panel') :
              (activeTab === 'membership' ? 'Your Membership Details' : 'Profile Settings')
            }
          </h2>
          
          {user?.role === 'admin' && activeTab === 'blog' ? (
            // Blog Posts Content
            posts.length === 0 ? (
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
                          
                          <div className="flex flex-wrap gap-2 self-start">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors min-w-[60px]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePost(post)}
                              className="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors min-w-[60px]"
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
            )
          ) : user?.role === 'admin' && activeTab === 'gallery' ? (
            // Gallery Items Content
            galleryItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  📸
                </div>
                <p className="text-green-300 text-lg mb-3">No gallery items yet</p>
                <p className="text-green-400/80 mb-6">Start building your Instagram-style gallery!</p>
                <button
                  onClick={handleNewGalleryItem}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Your First Gallery Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map((item, index) => (
                  <div key={index} className="bg-black/30 rounded-lg overflow-hidden border border-purple-400/20 hover:border-purple-400/40 transition-colors">
                    <div className="aspect-square relative">
                      <img
                        src={item.imageUrl}
                        alt={item.caption || 'Gallery item'}
                        className="w-full h-full object-cover"
                      />
                      {/* Media type indicators */}
                      {item.type === 'video' && (
                        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}

                      {/* Status indicator */}
                      <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                        item.isActive 
                          ? 'bg-green-600/80 text-white' 
                          : 'bg-gray-600/80 text-gray-200'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="text-white text-sm font-medium">{item.likes.toLocaleString()}</span>
                        <span className="text-green-300 text-xs ml-auto">#{item.sortOrder}</span>
                      </div>
                      
                      <p className="text-green-200 text-sm mb-3 line-clamp-2">
                        {item.caption || 'No caption'}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEditGalleryItem(item)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(item)}
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : user?.role === 'admin' && activeTab === 'payments' ? (
            // Payments Management Content
            <div className="space-y-6">
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'pending', 'completed', 'confirming', 'expired', 'cancelled'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPaymentFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      paymentFilter === filter
                        ? 'bg-orange-600 text-white'
                        : 'bg-black/30 text-green-300 hover:bg-black/50'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Payments List */}
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    💰
                  </div>
                  <p className="text-green-300 text-lg mb-3">No payments found</p>
                  <p className="text-green-400/80">Payments will appear here when users make purchases.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment._id} className="bg-black/30 rounded-lg p-6 border border-orange-400/20 hover:border-orange-400/40 transition-colors">
                      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white text-lg font-semibold">
                              {payment.firstName} {payment.lastName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'completed' 
                                ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                                : payment.status === 'pending'
                                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30'
                                : payment.status === 'confirming'
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                                : 'bg-red-600/20 text-red-400 border border-red-400/30'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-green-300 text-sm mb-1">Email: <span className="text-white">{payment.email}</span></p>
                              <p className="text-green-300 text-sm mb-1">Tier: <span className="text-white capitalize">{payment.tier}</span></p>
                              <p className="text-green-300 text-sm mb-1">Amount: <span className="text-white">{payment.amount} {payment.cryptoSymbol}</span></p>
                            </div>
                            <div>
                              <p className="text-green-300 text-sm mb-1">Confirmations: <span className="text-white">{payment.confirmations}/{payment.requiredConfirmations}</span></p>
                              <p className="text-green-300 text-sm mb-1">Created: <span className="text-white">{new Date(payment.createdAt).toLocaleDateString()}</span></p>
                              {payment.transactionHash && (
                                <p className="text-green-300 text-sm mb-1">TX: <span className="text-white font-mono text-xs">{payment.transactionHash.substring(0, 20)}...</span></p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handlePaymentAction(payment._id, 'verify')}
                              className="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Verify
                            </button>
                          )}
                          {payment.status !== 'cancelled' && payment.status !== 'completed' && (
                            <button
                              onClick={() => handlePaymentAction(payment._id, 'cancel')}
                              className="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : user?.role === 'admin' && activeTab === 'users' ? (
            // User Management Content
            <div className="space-y-6">
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'active', 'expired', 'cancelled'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setUserFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      userFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-black/30 text-green-300 hover:bg-black/50'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Users List */}
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    👥
                  </div>
                  <p className="text-green-300 text-lg mb-3">No users found</p>
                  <p className="text-green-400/80">Registered users will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="bg-black/30 rounded-lg p-6 border border-blue-400/20 hover:border-blue-400/40 transition-colors">
                      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-white text-lg font-semibold">
                              {user.firstName} {user.lastName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              getTierDisplayInfo(user.subscription?.tier || 'sapphire').color === 'blue'
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                                : getTierDisplayInfo(user.subscription?.tier || 'sapphire').color === 'red'
                                ? 'bg-red-600/20 text-red-400 border border-red-400/30'
                                : 'bg-purple-600/20 text-purple-400 border border-purple-400/30'
                            }`}>
                              {getTierDisplayInfo(user.subscription?.tier || 'sapphire').name}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.subscription?.status === 'active' 
                                ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                                : user.subscription?.status === 'expired'
                                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30'
                                : 'bg-red-600/20 text-red-400 border border-red-400/30'
                            }`}>
                              {user.subscription?.status || 'unknown'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <p className="text-green-300 text-sm mb-1">Email: <span className="text-white">{user.email}</span></p>
                              <p className="text-green-300 text-sm mb-1">Tier: <span className="text-white">{user.subscription?.tier || 'sapphire'}</span></p>
                              <p className="text-green-300 text-sm">Price: <span className="text-white">{getTierDisplayInfo(user.subscription?.tier || 'sapphire').price}</span></p>
                            </div>
                            <div>
                              <p className="text-green-300 text-sm mb-1">Status: <span className="text-white capitalize">{user.subscription?.status || 'unknown'}</span></p>
                              <p className="text-green-300 text-sm mb-1">Registered: <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                              <p className="text-green-300 text-sm">Payments: <span className="text-white">{user.completedPayments || 0}/{user.totalPayments || 0}</span></p>
                            </div>
                            {user.latestPayment && user.latestPayment.status === 'completed' && (
                              <div>
                                <p className="text-green-300 text-sm mb-1">Last Payment:</p>
                                <p className="text-white text-xs mb-1">Method: {user.latestPayment.cryptocurrency?.toUpperCase() || 'Unknown'}</p>
                                <p className="text-white text-xs mb-1">Amount: {user.latestPayment.amount} {user.latestPayment.cryptoSymbol}</p>
                                {user.latestPayment.transactionHash && (
                                  <p className="text-white text-xs">TX: {user.latestPayment.transactionHash.substring(0, 12)}...</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {user.subscription?.status === 'active' && (
                            <button
                              onClick={() => openUserModal(user, 'cancel_subscription')}
                              className="px-3 md:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          {user.subscription?.status === 'cancelled' && (
                            <button
                              onClick={() => openUserModal(user, 'reactivate_subscription')}
                              className="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => openUserModal(user, 'update_subscription')}
                            className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : user?.role === 'user' && activeTab === 'membership' ? (
            // User Membership Dashboard
            <div className="space-y-6">
              {/* Current Tier Info */}
              <div className="bg-black/30 rounded-lg p-6 border border-blue-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                    {getTierInfo(user.tier || 'sapphire').name.split(' ')[0]}
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">{getTierInfo(user.tier || 'sapphire').name}</h3>
                    <p className="text-green-300">{getTierInfo(user.tier || 'sapphire').price}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Your Benefits</h4>
                    <ul className="space-y-2">
                      {getTierInfo(user.tier || 'sapphire').benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-green-200 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Membership Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-300 text-sm">Status:</span>
                        <span className="text-green-400 text-sm font-medium">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300 text-sm">Member Since:</span>
                        <span className="text-white text-sm">{new Date().toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300 text-sm">Next Billing:</span>
                        <span className="text-white text-sm">{user.tier === 'sapphire' ? 'N/A (Free)' : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a 
                  href="/blog" 
                  className="bg-black/30 rounded-lg p-4 border border-green-400/30 hover:border-green-400/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-green-500 transition-colors">
                      📚
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Browse Blog</h4>
                      <p className="text-green-300 text-sm">Read exclusive content</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://t.me/GBShopXBot" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/30 rounded-lg p-4 border border-blue-400/30 hover:border-blue-400/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-blue-500 transition-colors">
                      💬
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Join Telegram</h4>
                      <p className="text-green-300 text-sm">Community support</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ) : user?.role === 'user' && activeTab === 'profile' ? (
            // User Profile Management
            <div className="space-y-6">
              <div className="bg-black/30 rounded-lg p-6 border border-green-400/30">
                <h3 className="text-white text-lg font-bold mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-green-400/30 rounded-lg text-white placeholder-green-300/50 focus:border-green-400 focus:outline-none"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 bg-black/50 border border-gray-400/30 rounded-lg text-gray-300 cursor-not-allowed"
                    placeholder="Email cannot be changed"
                  />
                  <p className="text-green-400/70 text-xs mt-1">Email address cannot be modified</p>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
              
              {/* Account Info */}
              <div className="bg-black/30 rounded-lg p-6 border border-blue-400/30">
                <h3 className="text-white text-lg font-bold mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-300">Account Type:</span>
                    <span className="text-white">Member Account</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Member ID:</span>
                    <span className="text-white font-mono">{user.email.split('@')[0].toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Current Tier:</span>
                    <span className="text-white">{getTierInfo(user.tier || 'sapphire').name}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* User Management Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-green-900 rounded-lg p-6 border border-green-400/30 max-w-md w-full">
            <h3 className="text-white text-xl font-bold mb-4">
              {userAction === 'update_subscription' ? 'Update Subscription' :
               userAction === 'cancel_subscription' ? 'Cancel Subscription' :
               'Reactivate Subscription'}
            </h3>
            
            <div className="mb-4">
              <p className="text-green-300 text-sm mb-2">User: <span className="text-white">{selectedUser.firstName} {selectedUser.lastName}</span></p>
              <p className="text-green-300 text-sm mb-2">Email: <span className="text-white">{selectedUser.email}</span></p>
              <p className="text-green-300 text-sm">Current Tier: <span className="text-white capitalize">{selectedUser.subscription?.tier || 'sapphire'}</span></p>
            </div>

            {userAction === 'update_subscription' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tier</label>
                  <select 
                    defaultValue={selectedUser.subscription?.tier || 'sapphire'}
                    className="w-full px-3 py-2 bg-black/30 border border-green-400/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    id="tierSelect"
                  >
                    <option value="sapphire">🔷 Sapphire (Free)</option>
                    <option value="ruby">♦️ Ruby (£10/month)</option>
                    <option value="diamond">💎 Diamond (£15.99/month)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Status</label>
                  <select 
                    defaultValue={selectedUser.subscription?.status || 'active'}
                    className="w-full px-3 py-2 bg-black/30 border border-green-400/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    id="statusSelect"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            )}

            {userAction === 'cancel_subscription' && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">Are you sure you want to cancel this user's subscription? They will lose access to premium features.</p>
              </div>
            )}

            {userAction === 'reactivate_subscription' && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6">
                <p className="text-green-300 text-sm">This will reactivate the user's subscription and restore their access to premium features.</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (userAction === 'update_subscription') {
                    const tierSelect = document.getElementById('tierSelect') as HTMLSelectElement;
                    const statusSelect = document.getElementById('statusSelect') as HTMLSelectElement;
                    
                    const subscriptionData = {
                      tier: tierSelect.value,
                      status: statusSelect.value,
                      price: tierSelect.value === 'ruby' ? 10 : tierSelect.value === 'diamond' ? 15.99 : 0
                    };
                    
                    handleUserAction(selectedUser._id, userAction, subscriptionData, `Subscription updated by admin`);
                  } else {
                    handleUserAction(selectedUser._id, userAction, null, `Subscription ${userAction.replace('_', ' ')} by admin`);
                  }
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  userAction === 'cancel_subscription' 
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {userAction === 'update_subscription' ? 'Update' :
                 userAction === 'cancel_subscription' ? 'Cancel Subscription' :
                 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 