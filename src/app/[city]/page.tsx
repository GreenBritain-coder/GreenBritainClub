import Link from "next/link";
import { Metadata } from "next";

interface CityPageProps {
  params: {
    city: string;
  };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  const cityLower = params.city.toLowerCase();
  
  return {
    title: `Cannabis Delivery ${city} | Weed ${city} | GreenBritain.Club`,
    description: `Premium cannabis delivery in ${city}. Fast, discreet weed delivery to ${city} with secure packaging. Join our Telegram community @GBShopXBot for exclusive ${city} deals.`,
    keywords: [
      `cannabis ${cityLower}`,
      `weed delivery ${cityLower}`,
      `cannabis ${cityLower} delivery`,
      `weed ${cityLower}`,
      `cannabis ${cityLower} UK`,
      `weed ${cityLower} UK`,
      `cannabis delivery ${cityLower}`,
      `weed ${cityLower} telegram`,
      `cannabis ${cityLower} telegram`,
      `GBShopXBot ${cityLower}`,
      `GreenBritain ${cityLower}`,
      `cannabis community ${cityLower}`,
      `weed community ${cityLower}`,
      `cannabis deals ${cityLower}`,
      `weed deals ${cityLower}`
    ],
    openGraph: {
      title: `Cannabis Delivery ${city} | GreenBritain.Club`,
      description: `Premium cannabis delivery in ${city}. Fast, discreet weed delivery with secure packaging.`,
      url: `https://greenbritain.club/${cityLower}`,
    },
  };
}

export default function CityPage({ params }: CityPageProps) {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  const cityLower = params.city.toLowerCase();

  const features = [
    {
      title: "Same Day Delivery",
      description: `Fast, reliable delivery to ${city} with discreet packaging and secure handling.`,
      icon: "🚚"
    },
    {
      title: "Premium Quality",
      description: "Hand-selected premium cannabis products from trusted suppliers across the UK.",
      icon: "⭐"
    },
    {
      title: "Secure & Private",
      description: "Complete privacy and security with encrypted communications and discreet service.",
      icon: "🔒"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support available through our Telegram community.",
      icon: "💬"
    }
  ];

  const nearbyCities = [
    "London", "Manchester", "Birmingham", "Leeds", "Liverpool", 
    "Sheffield", "Bristol", "Glasgow", "Edinburgh", "Cardiff",
    "Newcastle", "Nottingham", "Leicester", "Coventry", "Bradford",
    "Stoke-on-Trent", "Wolverhampton", "Plymouth", "Southampton", "Reading"
  ].filter(c => c.toLowerCase() !== cityLower).slice(0, 8);

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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Cannabis Delivery in <span className="text-green-400">{city}</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-200 mb-8">
            Premium cannabis products delivered discreetly to {city} with fast, secure service
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
              <span>Order in {city}</span>
            </a>
            <Link 
              href="/telegram"
              className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Join Telegram
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Why Choose <span className="text-green-400">GreenBritain.Club</span> in {city}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-green-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Order Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            How to Order in <span className="text-green-400">{city}</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Join Telegram</h3>
              <p className="text-green-200">Click the button above to join our Telegram community @GBShopXBot</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Browse Products</h3>
              <p className="text-green-200">View our complete catalog of premium cannabis products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fast Delivery</h3>
              <p className="text-green-200">Get your order delivered discreetly to {city} with secure packaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Cities Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Also Available in <span className="text-green-400">Other Cities</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nearbyCities.map((nearbyCity) => (
            <Link 
              key={nearbyCity}
              href={`/${nearbyCity.toLowerCase()}`}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-green-400/20 hover:border-green-400/40 transition-colors text-center"
            >
              <h3 className="text-white font-semibold">{nearbyCity}</h3>
              <p className="text-green-300 text-sm">Available</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Order in <span className="text-green-400">{city}</span>?
          </h2>
          <p className="text-green-200 mb-6">
            Join thousands of satisfied customers in {city} who trust GreenBritain.Club for their cannabis needs.
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
            <span>Start Ordering Now</span>
          </a>
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