import Link from 'next/link';

export default function Navigation() {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-green-400/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">GB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GreenBritain.Club</h1>
                <p className="text-green-300 text-sm">Premium Cannabis Community</p>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-white hover:text-green-400 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="text-green-400 font-medium"
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
              href="/management" 
              className="text-white hover:text-blue-400 font-medium transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Login</span>
            </Link>
            <a 
              href="https://t.me/GBShopXBot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              <span className="hidden lg:inline">Join Telegram</span>
              <span className="md:inline lg:hidden">Telegram</span>
            </a>
          </div>
          
          {/* Mobile menu buttons */}
          <div className="md:hidden flex flex-wrap items-center gap-1 max-w-[200px]">
            <Link 
              href="/blog"
              className="text-white hover:text-green-400 font-medium transition-colors px-2 py-1 rounded text-xs"
            >
              📝 Blog
            </Link>
            <Link 
              href="/membership"
              className="text-white hover:text-purple-400 font-medium transition-colors px-2 py-1 rounded text-xs"
            >
              💎 Join
            </Link>
            <Link 
              href="/management" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full font-semibold transition-colors flex items-center gap-1 text-xs min-w-[50px]"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Login</span>
            </Link>
            <a 
              href="https://t.me/GBShopXBot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-full font-semibold transition-colors flex items-center gap-1 text-xs min-w-[40px]"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              <span>TG</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
} 