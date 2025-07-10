import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-900/40 backdrop-blur-sm border-t border-green-400/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white hover:text-green-300 transition">
              GreenBritain.Club
            </Link>
            <p className="text-green-300 mt-3 text-sm max-w-md">
              Premium cannabis products available across all major UK cities. 
              Join our community for exclusive deals and discreet delivery.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://t.me/GBShopXBot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 hover:text-white transition-colors"
                aria-label="Join our Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-300 hover:text-white transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-green-300 hover:text-white transition text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/telegram" className="text-green-300 hover:text-white transition text-sm">
                  Telegram Community
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-green-300 hover:text-white transition text-sm">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/management" className="text-green-300 hover:text-white transition text-sm">
                  Management
                </Link>
              </li>
            </ul>
          </div>

          {/* UK Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4">UK Locations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/london" className="text-green-300 hover:text-white transition text-sm">
                  London
                </Link>
              </li>
              <li>
                <Link href="/manchester" className="text-green-300 hover:text-white transition text-sm">
                  Manchester
                </Link>
              </li>
              <li>
                <Link href="/birmingham" className="text-green-300 hover:text-white transition text-sm">
                  Birmingham
                </Link>
              </li>
              <li>
                <Link href="/leeds" className="text-green-300 hover:text-white transition text-sm">
                  Leeds
                </Link>
              </li>
              <li>
                <Link href="/liverpool" className="text-green-300 hover:text-white transition text-sm">
                  Liverpool
                </Link>
              </li>
              <li>
                <Link href="/glasgow" className="text-green-300 hover:text-white transition text-sm">
                  Glasgow
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-400/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-green-400 text-sm mb-4 md:mb-0">
              © 2024 GreenBritain.Club. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <span className="text-green-300">Age 18+ Only</span>
              <span className="text-green-300">UK Residents</span>
              <span className="text-green-300">Discreet & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 