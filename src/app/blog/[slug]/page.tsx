import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navigation from '../../components/Navigation';

// Define blog post interface
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
  featuredImage?: string;
  additionalImages?: string[];
  keywords?: string[];
  cities?: string[];
  createdAt: string;
  updatedAt?: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
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

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p: BlogPost) => p.slug === slug) || null;
}

async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  
  // Filter out the current post and drafts
  const publishedPosts = allPosts.filter(post => 
    post.slug !== currentSlug && post.status === 'published'
  );
  
  // Get random related posts
  const shuffled = [...publishedPosts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  // Await params to ensure it's fully resolved
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | GreenBritain.Club',
      description: 'The requested blog post could not be found.'
    };
  }
  
  // Create city-specific descriptions if cities are available
  let description = post.excerpt;
  if (post.cities && post.cities.length > 0) {
    description = `${post.excerpt} Information relevant to ${post.cities.slice(0, 5).join(', ')} and other UK cities.`;
  }
  
  return {
    title: `${post.title} | GreenBritain.Club Blog`,
    description,
    keywords: post.keywords || [],
    openGraph: {
      title: post.title,
      description: description,
      images: [post.featuredImage || ''],
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: [post.featuredImage || ''],
    }
  };
}

// Helper function to convert markdown headings to HTML
function processMarkdown(content: string): string[] {
  // Split content by paragraphs
  const paragraphs = content.split('\n\n');
  
  // Process each paragraph
  return paragraphs.map(paragraph => {
    // Handle headings
    if (paragraph.startsWith('# ')) {
      return `<h1 class="text-3xl font-bold text-white mt-8 mb-4">${paragraph.substring(2)}</h1>`;
    }
    if (paragraph.startsWith('## ')) {
      return `<h2 class="text-2xl font-bold text-white mt-6 mb-3">${paragraph.substring(3)}</h2>`;
    }
    if (paragraph.startsWith('### ')) {
      return `<h3 class="text-xl font-bold text-white mt-5 mb-2">${paragraph.substring(4)}</h3>`;
    }
    
    // Handle lists
    if (paragraph.startsWith('- ')) {
      const items = paragraph.split('\n').map(item => {
        if (item.startsWith('- ')) {
          return `<li class="ml-6 mb-1 text-white/90">${item.substring(2)}</li>`;
        }
        return item;
      });
      return `<ul class="list-disc mb-4">${items.join('')}</ul>`;
    }
    
    // Handle numbered lists
    if (/^\d+\.\s/.test(paragraph)) {
      const items = paragraph.split('\n').map(item => {
        if (/^\d+\.\s/.test(item)) {
          return `<li class="ml-6 mb-1 text-white/90">${item.substring(item.indexOf(' ') + 1)}</li>`;
        }
        return item;
      });
      return `<ol class="list-decimal mb-4">${items.join('')}</ol>`;
    }
    
    // Handle images
    if (paragraph.startsWith('![')) {
      const altEnd = paragraph.indexOf('](');
      const srcEnd = paragraph.indexOf(')', altEnd);
      if (altEnd > 0 && srcEnd > 0) {
        const alt = paragraph.substring(2, altEnd);
        const src = paragraph.substring(altEnd + 2, srcEnd);
        return `<div class="my-6 relative">
          <img src="${src}" alt="${alt}" class="rounded-lg w-full" />
          <p class="text-sm text-green-300 mt-2 text-center">${alt}</p>
        </div>`;
      }
    }
    
    // Regular paragraph
    return `<p class="mb-4 text-white/90">${paragraph}</p>`;
  });
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  // Await params to ensure it's fully resolved
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug;
  
  // Get post by slug
  const post = await getPostBySlug(slug);
  
  if (!post || post.status !== 'published') {
    notFound();
  }
  
  // Get related posts
  const relatedPosts = await getRelatedPosts(slug);
  
  // Default image if no featured image is available
  const defaultImage = 'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
  
  // Process content if it contains markdown
  const processedContent = post.content.startsWith('#') ? processMarkdown(post.content) : post.content.split('\n\n');
  
  // Check if the post has city information for the SEO section
  const hasCities = post.cities && post.cities.length > 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      <Navigation />
      <main>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back to blog link */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-green-400 hover:text-white transition font-medium"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
        
        {/* Article header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>
          <div className="flex items-center text-green-400 mb-8">
            <span>
              {new Date(post.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <> · Updated: {new Date(post.updatedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</>
              )}
            </span>
          </div>
        </div>
        
        {/* Featured image */}
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
          <Image 
            src={post.featuredImage || defaultImage} 
            alt={post.title}
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        {/* Article content */}
        <div className="bg-green-800/20 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-green-400/20">
          <div className="prose prose-lg prose-invert prose-green max-w-none">
            <p className="text-xl text-green-200 font-medium mb-6">
              {post.excerpt}
            </p>
            
            {/* Render content - with markdown support */}
            {post.content.startsWith('#') ? (
              <div dangerouslySetInnerHTML={{ __html: processedContent.join('') }} />
            ) : (
              processedContent.map((paragraph: string, i: number) => (
                <p key={i} className="mb-6 text-white/90">
                  {paragraph}
                </p>
              ))
            )}
            
            {/* Additional images gallery */}
            {post.additionalImages && post.additionalImages.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6">Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {post.additionalImages.map((imgSrc, index) => (
                    <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                      <Image 
                        src={imgSrc} 
                        alt={`${post.title} - Image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* City-specific information for SEO */}
        {hasCities && post.cities && (
          <div className="mt-12 bg-green-800/30 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-green-400/20">
            <h3 className="text-2xl font-bold text-white mb-4">Regional Information</h3>
            <p className="text-green-200 mb-4">
              This article contains information relevant to cannabis policies and developments in the following UK cities:
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.cities.map((city, index) => (
                <span 
                  key={index} 
                  className="bg-green-700/50 text-white px-3 py-1 rounded-full text-sm"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-green-200">
              For city-specific information and local cannabis policies, please refer to the relevant sections in the article above.
            </p>
          </div>
        )}
        
        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost._id} className="bg-green-800/30 rounded-lg overflow-hidden border border-green-400/10 hover:border-green-400/30 transition">
                  <div className="relative w-full h-48">
                    <Image 
                      src={relatedPost.featuredImage || defaultImage} 
                      alt={relatedPost.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-green-300 transition">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-green-200 mb-4 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link 
                      href={`/blog/${relatedPost.slug}`}
                      className="inline-flex items-center text-green-400 hover:text-white transition text-sm font-medium"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Share and community CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-green-400/20">
          <h3 className="text-xl font-bold text-white mb-4">
            Join the GreenBritain.Club Community
          </h3>
          <p className="text-green-200 mb-6">
            Connect with fellow cannabis enthusiasts across the UK. Get exclusive access to premium products, 
            community discussions, and the latest cannabis news.
          </p>
          <Link 
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Join Our Community
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
