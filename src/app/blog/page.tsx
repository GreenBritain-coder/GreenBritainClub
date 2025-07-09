import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "Cannabis Blog | GreenBritain.Club",
  description: "Read the latest cannabis news, guides, and community updates from GreenBritain.Club. UK cannabis delivery, growing tips, and more!",
};

async function getBlogPosts() {
  try {
    // Use server-side fetch for SSR
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blog/posts`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    const posts = await res.json();
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  // Default image if no featured image is available
  const defaultImage = 'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-green-950">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">GreenBritain.Club Blog</h1>
          <p className="text-xl text-green-300 max-w-3xl mx-auto">
            Explore the latest insights, guides, and news about cannabis culture in the UK
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-green-800/30 mb-6">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Blog Posts Yet</h2>
            <p className="text-green-300">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured post */}
            {posts.length > 0 && posts[0].status === 'published' && (
              <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl overflow-hidden mb-12 border border-green-400/20">
                <div className="relative w-full h-64 md:h-80">
                  <Image 
                    src={posts[0].featuredImage || defaultImage} 
                    alt={posts[0].title}
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6 md:p-8">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white mb-4">
                    Featured Article
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    <Link href={`/blog/${posts[0].slug}`} className="hover:text-green-300 transition">
                      {posts[0].title}
                    </Link>
                  </h2>
                  <p className="text-green-200 mb-4 line-clamp-3">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/blog/${posts[0].slug}`}
                      className="inline-flex items-center text-green-400 hover:text-white transition font-medium"
                    >
                      Read Full Article
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <span className="text-sm text-green-400">
                      {new Date(posts[0].createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Grid of posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts
                .filter(post => post.status === 'published')
                .slice(1) // Skip the first post (featured)
                .map((post) => (
                  <div key={post._id} className="bg-green-800/30 rounded-lg overflow-hidden border border-green-400/10 hover:border-green-400/30 transition">
                    <div className="relative w-full h-48">
                      <Image 
                        src={post.featuredImage || defaultImage} 
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        <Link href={`/blog/${post.slug}`} className="hover:text-green-300 transition">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-green-200 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-green-400 hover:text-white transition font-medium"
                        >
                          Read More
                        </Link>
                        <span className="text-xs text-green-400">
                          {new Date(post.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
