import Link from "next/link";

export const metadata = {
  title: "Join GreenBritain.Club Telegram Community | @GBShopXBot | UK Cannabis Deals",
  description: "Join our exclusive Telegram community @GBShopXBot for daily cannabis deals, new product alerts, and special promotions across all UK cities. London, Manchester, Birmingham and more.",
  keywords: [
    "GBShopXBot",
    "Telegram cannabis",
    "cannabis Telegram group",
    "UK cannabis deals",
    "cannabis promotions",
    "Telegram weed",
    "cannabis community UK",
    "weed deals London",
    "cannabis deals Manchester",
    "weed Telegram"
  ],
};

export default function TelegramPage() {
  const features = [
    {
      title: "Daily Deals & Promotions",
      description: "Get exclusive access to limited-time offers and special discounts on premium products.",
      icon: "🎯"
    },
    {
      title: "New Product Alerts",
      description: "Be the first to know about new strains and products as soon as they're available.",
      icon: "🆕"
    },
    {
      title: "24/7 Customer Support",
      description: "Get instant help and support from our dedicated team anytime, day or night.",
      icon: "💬"
    },
    {
      title: "Community Updates",
      description: "Stay informed about delivery schedules, service updates, and community news.",
      icon: "📢"
    },
    {
      title: "Exclusive Content",
      description: "Access to product reviews, strain information, and cannabis education content.",
      icon: "📚"
    },
    {
      title: "Member-Only Offers",
      description: "Special discounts and offers available exclusively to our Telegram community members.",
      icon: "👑"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-green-400/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">GB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GreenBritain.Club</h1>
                <p className="text-green-300 text-sm">Premium Cannabis Community</p>
              </div>
            </Link>
            <Link 
              href="/" 
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Join Our <span className="text-green-400">Telegram Community</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-200 mb-8">
            Connect with thousands of satisfied customers across the UK
          </p>
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">@GBShopXBot</h2>
            <p className="text-green-200 mb-6">
              Our official Telegram bot provides instant access to our complete product catalog, 
              secure ordering system, and real-time customer support.
            </p>
            <a 
              href="https://t.me/GBShopXBot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center space-x-3 justify-center"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              <span>Join @GBShopXBot Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          What You'll Get as a <span className="text-green-400">Member</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-green-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Join Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            How to <span className="text-green-400">Join</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Click the Link</h3>
              <p className="text-green-200">Click the "Join @GBShopXBot" button above to open Telegram</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start the Bot</h3>
              <p className="text-green-200">Send /start to begin and follow the setup instructions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start Shopping</h3>
              <p className="text-green-200">Browse products, place orders, and enjoy exclusive deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-green-400/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-green-300 mb-4">
              © 2024 GreenBritain.Club - Premium Cannabis Community
            </p>
            <p className="text-green-400 text-sm">
              Age 18+ Only • UK Residents • Discreet & Secure Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 