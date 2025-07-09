
import Link from "next/link";
import Image from "next/image";

// Define blog post interface
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
    return Array.isArray(posts) ? posts.filter(post => post.status === 'published') : [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function Home() {
  const ukCities = [
    "London", "Manchester", "Birmingham", "Leeds", "Liverpool", 
    "Sheffield", "Bristol", "Glasgow", "Edinburgh", "Cardiff",
    "Newcastle", "Nottingham", "Leicester", "Coventry", "Bradford",
    "Stoke-on-Trent", "Wolverhampton", "Plymouth", "Southampton", "Reading"
  ];

  // Get the latest blog posts
  const blogPosts = await getBlogPosts();
  const latestPosts = blogPosts.slice(0, 2); // Get first 2 posts for homepage
  
  // Default image if no featured image is available
  const defaultImage = 'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-green-400/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">GB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GreenBritain.Club</h1>
                <p className="text-green-300 text-sm">Premium Cannabis Community</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/blog" 
                className="text-white hover:text-green-400 font-medium transition-colors"
              >
                Blog
              </Link>
              <Link 
                href="/membership" 
                className="text-white hover:text-green-400 font-medium transition-colors"
              >
                Membership
              </Link>
              <Link 
                href="#telegram" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                <span>Join Telegram</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Welcome to <span className="text-green-400">GreenBritain.Club</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-200 mb-8">
            Your premier destination for premium cannabis products across the UK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="#telegram"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              <span>Join @GBShopXBot</span>
            </Link>
            <Link 
              href="/blog"
              className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Explore Our Blog
            </Link>
            <Link 
              href="/membership"
              className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Join Membership
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
            <p className="text-green-200">Hand-selected premium cannabis products from trusted suppliers across the UK.</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nationwide Delivery</h3>
            <p className="text-green-200">Fast, discreet delivery to all major UK cities with secure packaging.</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
            <p className="text-green-200">Complete privacy and security with encrypted communications and discreet service.</p>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Exclusive <span className="text-green-400">Membership</span> Benefits
        </h2>
        <p className="text-xl text-green-200 text-center mb-12 max-w-3xl mx-auto">
          Join our community with a membership tier that suits your needs and unlock exclusive benefits
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sapphire Tier */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-blue-400/30 transition-transform hover:scale-105">
            <div className="bg-blue-500/20 p-6 text-center border-b border-blue-400/30">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Sapphire</h3>
              <p className="text-white text-3xl font-bold">Free</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Access to basic blog content</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Monthly newsletter</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Community forum access</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Limited discounts on products</span>
                </li>
              </ul>
              <Link 
                href="/membership"
                className="block bg-blue-500 hover:bg-blue-600 text-white text-center px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Join Free
              </Link>
            </div>
          </div>
          
          {/* Ruby Tier */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-red-400/30 transform scale-105 shadow-lg shadow-red-900/20">
            <div className="bg-red-500/20 p-6 text-center border-b border-red-400/30 relative">
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Ruby</h3>
              <p className="text-white text-3xl font-bold">£10<span className="text-lg">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">All Sapphire benefits</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Exclusive content access</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Priority customer support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">10% discount on all products</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Monthly cannabis samples</span>
                </li>
              </ul>
              <Link 
                href="/membership"
                className="block bg-red-500 hover:bg-red-600 text-white text-center px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
          
          {/* Diamond Tier */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-400/30 transition-transform hover:scale-105">
            <div className="bg-purple-500/20 p-6 text-center border-b border-purple-400/30">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-2">Diamond</h3>
              <p className="text-white text-3xl font-bold">£15.99<span className="text-lg">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">All Ruby benefits</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">VIP event invitations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Early access to new products</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">20% discount on all products</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Premium cannabis samples monthly</span>
          </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Personal cannabis consultant</span>
          </li>
              </ul>
              <Link 
                href="/membership"
                className="block bg-purple-500 hover:bg-purple-600 text-white text-center px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Get Diamond
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Highlight Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Latest from Our <span className="text-green-400">Blog</span>
        </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {latestPosts.length > 0 ? (
             latestPosts.map((post) => (
               <Link key={post._id} href={`/blog/${post.slug}`} className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-colors">
                 <div className="h-48 relative">
                   <Image
                     src={post.featuredImage || defaultImage}
                     alt={post.title}
                     fill
                     style={{ objectFit: 'cover' }}
                     className="opacity-70"
                   />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end p-4">
                     <h3 className="text-xl font-bold text-white">{post.title}</h3>
                   </div>
                 </div>
                 <div className="p-4">
                   <p className="text-green-300 text-sm mb-3">{new Date(post.createdAt).toLocaleDateString('en-GB', {
                     day: 'numeric',
                     month: 'short',
                     year: 'numeric'
                   })}</p>
                   <p className="text-white/80 mb-4">{post.excerpt}</p>
                   <div className="text-green-400 font-medium flex items-center">
                     Read More
                     <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </div>
                 </div>
               </Link>
             ))
           ) : (
             // Fallback if no posts are available
             <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-green-400/20 flex flex-col items-center justify-center p-8 text-center">
               <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
               <p className="text-green-200">Our blog content is being prepared</p>
             </div>
           )}
           
           {/* Always show the "Explore More" card */}
           <div className="bg-green-700/30 backdrop-blur-sm rounded-lg overflow-hidden border border-green-400/40 flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Explore More Articles</h3>
            <p className="text-green-200 mb-6">Discover our full collection of articles, guides, and news about cannabis.</p>
            <Link 
              href="/blog"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Visit Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* UK Cities Section */}
      <section id="cities" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Available Across <span className="text-green-400">Major UK Cities</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ukCities.map((city) => (
            <div key={city} className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-green-400/20 hover:border-green-400/40 transition-colors cursor-pointer">
              <h3 className="text-white font-semibold text-center">{city}</h3>
              <p className="text-green-300 text-sm text-center">Available</p>
            </div>
          ))}
        </div>
      </section>

      {/* Telegram Section */}
      <section id="telegram" className="container mx-auto px-4 py-16">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our <span className="text-green-400">Telegram Community</span>
            </h2>
            <p className="text-green-200 mb-6 text-lg">
              Get exclusive access to daily deals, new product announcements, and special promotions. 
              Join thousands of satisfied customers across the UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://t.me/GBShopXBot"
            target="_blank"
            rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                <span>@GBShopXBot</span>
              </a>
              <div className="text-green-300 text-sm">
                <p>✓ Daily Deals & Promotions</p>
                <p>✓ New Product Alerts</p>
                <p>✓ 24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-green-400/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">GB</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">GreenBritain.Club</h3>
                  <p className="text-green-300 text-sm">Premium Cannabis Community</p>
                </div>
              </div>
              <p className="text-green-200 mb-4">
                Your premier destination for premium cannabis products across the UK.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-green-300 hover:text-green-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-green-300 hover:text-green-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="text-green-300 hover:text-green-400 transition-colors">
                    Membership
                  </Link>
                </li>
                <li>
                  <a href="#cities" className="text-green-300 hover:text-green-400 transition-colors">
                    UK Cities
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Connect With Us</h4>
              <p className="text-green-200 mb-4">
                Join our Telegram community for exclusive deals and updates.
              </p>
              <a 
                href="#telegram"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                <span>@GBShopXBot</span>
              </a>
            </div>
          </div>
          
          <div className="border-t border-green-400/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-300 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GreenBritain.Club. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-300 hover:text-green-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-green-300 hover:text-green-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
