import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Params {
  slug: string;
}

const posts: Record<string, { title: string; date: string; category: string; content: string }> = {
  "welcome-to-greenbritain": {
    title: "Welcome to GreenBritain.Club!",
    date: "2024-07-08",
    category: "Community",
    content: `
      <div class="prose prose-invert prose-green max-w-none">
        <p class="text-lg text-green-200 mb-6">Welcome to GreenBritain.Club, the UK's premier cannabis community platform! We're thrilled to have you join our growing network of cannabis enthusiasts across Britain.</p>
        
        <h2 class="text-2xl font-bold text-white mt-8 mb-4">What is GreenBritain.Club?</h2>
        <p class="text-green-200 mb-4">GreenBritain.Club is more than just a website  it's a vibrant community dedicated to cannabis culture, education, and connection throughout the United Kingdom.</p>

        <h2 class="text-2xl font-bold text-white mt-8 mb-4">Join Our Telegram Community</h2>
        <p class="text-green-200 mb-4">The heart of our community lives on Telegram, where members can access exclusive offerings and participate in discussions.</p>
        
        <div class="bg-green-800/30 border border-green-400/30 rounded-lg p-6 my-8">
          <p class="text-green-100 text-center text-lg font-semibold">
            Ready to join? <a href="/telegram" class="text-green-400 underline hover:text-green-300">Click here to access our Telegram community</a>
          </p>
        </div>

        <p class="text-green-200 text-lg">Welcome to the community  we're excited to have you here! </p>
      </div>
    `
  },
  "cannabis-delivery-uk-guide": {
    title: "Cannabis Delivery in the UK: A Complete Guide",
    date: "2024-07-07",
    category: "Guide",
    content: `
      <div class="prose prose-invert prose-green max-w-none">
        <p class="text-lg text-green-200 mb-6">Navigating cannabis delivery in the UK requires knowledge, discretion, and connection to the right communities.</p>
        
        <h2 class="text-2xl font-bold text-white mt-8 mb-4">How to Connect</h2>
        <ol class="list-decimal list-inside text-green-200 mb-6 space-y-3">
          <li><strong>Join our Telegram community</strong> - Gateway to community resources</li>
          <li><strong>Verify your location</strong> - Connect with local members</li>
          <li><strong>Engage respectfully</strong> - Values respect and responsible use</li>
        </ol>

        <div class="bg-green-800/30 border border-green-400/30 rounded-lg p-6 my-8">
          <p class="text-green-100 text-center text-lg font-semibold">
            Ready to join? <a href="/telegram" class="text-green-400 underline hover:text-green-300">Access our Telegram here</a>
          </p>
        </div>
      </div>
    `
  }
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = posts[slug];
  
  if (!post) {
    return {
      title: "Post Not Found | GreenBritain.Club",
      description: "The requested blog post could not be found."
    };
  }

  return {
    title: `${post.title} | GreenBritain.Club`,
    description: `Read about ${post.title} on GreenBritain.Club - your premier UK cannabis community.`,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = posts[slug];
  
  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-green-400/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg"></span>
              </div>
              <span className="text-2xl font-bold text-white">GreenBritain.Club</span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-green-300 hover:text-white transition-colors">Home</Link>
              <Link href="/blog" className="text-green-300 hover:text-white transition-colors">Blog</Link>
              <Link href="/telegram" className="text-green-300 hover:text-white transition-colors">Telegram</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="text-green-400 hover:text-green-300 text-sm font-medium">
               Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                {post.category}
              </span>
              <span className="text-green-300 text-sm">
                {new Date(post.date).toLocaleDateString('en-UK', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
          </header>

          {/* Article Content */}
          <article className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-green-400/20 mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link 
              href="/blog"
              className="text-green-400 hover:text-green-300 font-medium inline-flex items-center space-x-2"
            >
              <span></span>
              <span>Back to Blog</span>
            </Link>
            <Link 
              href="/telegram"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
