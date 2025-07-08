import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Cannabis Blog | GreenBritain.Club",
  description: "Read the latest cannabis news, guides, and community updates from GreenBritain.Club. UK cannabis delivery, growing tips, and more!",
};

const posts = [
  {
    slug: "welcome-to-greenbritain",
    title: "Welcome to GreenBritain.Club!",
    excerpt: "Your premier cannabis community hub in the UK. Connect, learn, and discover the best cannabis culture has to offer.",
    date: "2024-07-08",
    category: "Community"
  },
  {
    slug: "cannabis-delivery-uk-guide",
    title: "Cannabis Delivery in the UK: A Complete Guide",
    excerpt: "Everything you need to know about safe, discreet cannabis delivery across UK cities. Join our Telegram for exclusive access.",
    date: "2024-07-07",
    category: "Guide"
  },
  {
    slug: "joining-cannabis-community",
    title: "How to Join the UK Cannabis Community",
    excerpt: "Step-by-step guide to connecting with fellow cannabis enthusiasts through our secure Telegram network.",
    date: "2024-07-06",
    category: "Community"
  },
  {
    slug: "cannabis-culture-uk",
    title: "Cannabis Culture in the UK: Past, Present & Future",
    excerpt: "Exploring the evolution of cannabis culture in Britain and what the future holds for our community.",
    date: "2024-07-05",
    category: "Culture"
  }
];

export default function BlogPage() {
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
              <Link href="/blog" className="text-white font-semibold">Blog</Link>
              <Link href="/telegram" className="text-green-300 hover:text-white transition-colors">Telegram</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Cannabis Blog
            </h1>
            <p className="text-xl text-green-200 max-w-2xl mx-auto">
              Latest news, guides, and community updates from the UK's premier cannabis community
            </p>
          </div>

          {/* Featured Post */}
          {posts.length > 0 && (
            <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl p-8 mb-12 border border-green-400/20">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Featured
                </span>
                <span className="text-green-300 text-sm">{posts[0].category}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                <Link href={`/blog/${posts[0].slug}`} className="hover:text-green-400 transition-colors">
                  {posts[0].title}
                </Link>
              </h2>
              <p className="text-green-200 text-lg mb-4">{posts[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <p className="text-green-400 text-sm">
                  {new Date(posts[0].date).toLocaleDateString('en-UK', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <Link 
                  href={`/blog/${posts[0].slug}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          )}

          {/* Recent Posts */}
          <div className="grid md:grid-cols-2 gap-8">
            {posts.slice(1).map(post => (
              <article key={post.slug} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/20 hover:border-green-400/40 transition-all">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-green-400 text-sm font-medium">{post.category}</span>
                  <span className="text-green-600"></span>
                  <span className="text-green-300 text-sm">
                    {new Date(post.date).toLocaleDateString('en-UK')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  <Link href={`/blog/${post.slug}`} className="hover:text-green-400 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-green-200 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-green-400 hover:text-green-300 font-semibold text-sm inline-flex items-center space-x-1"
                >
                  <span>Read Article</span>
                  <span></span>
                </Link>
              </article>
            ))}
          </div>

          {/* Community CTA */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Cannabis Community
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Connect with fellow cannabis enthusiasts across the UK. Get exclusive access to premium products, 
              community discussions, and the latest cannabis news.
            </p>
            <Link 
              href="/telegram"
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-bold transition-colors inline-flex items-center space-x-2"
            >
              <span>Join Telegram Community</span>
              <span></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
