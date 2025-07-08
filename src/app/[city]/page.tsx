import { Metadata } from 'next';

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  
  return {
    title: Cannabis in ${cityName} | GreenBritain.Club,
    description: Find the best cannabis information and community in ${cityName}. Join GreenBritain.Club for local cannabis news, reviews, and connections.,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Cannabis in <span className="text-green-400">{cityName}</span>
          </h1>
          <p className="text-xl text-green-200 max-w-3xl mx-auto">
            Welcome to your local cannabis community hub for {cityName}. 
            Connect with fellow enthusiasts and stay informed about the latest developments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
            <h3 className="text-2xl font-bold text-green-400 mb-4">Local Community</h3>
            <p className="text-green-100 mb-6">
              Connect with cannabis enthusiasts in {cityName} through our Telegram community.
            </p>
            <a 
              href="/telegram" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Join Community
            </a>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
            <h3 className="text-2xl font-bold text-green-400 mb-4">Latest News</h3>
            <p className="text-green-100 mb-6">
              Stay updated with cannabis news and developments specific to {cityName}.
            </p>
            <a 
              href="/blog" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Read Blog
            </a>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
            <h3 className="text-2xl font-bold text-green-400 mb-4">Local Events</h3>
            <p className="text-green-100 mb-6">
              Discover cannabis-related events and meetups happening in {cityName}.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
              Coming Soon
            </button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Choose GreenBritain.Club in {cityName}?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="text-xl font-semibold text-green-400 mb-3">Local Focus</h4>
              <p className="text-green-100">
                We understand the unique cannabis culture and regulations in {cityName}.
              </p>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-semibold text-green-400 mb-3">Community Driven</h4>
              <p className="text-green-100">
                Built by and for cannabis enthusiasts in {cityName} and across the UK.
              </p>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-semibold text-green-400 mb-3">Safe Space</h4>
              <p className="text-green-100">
                A welcoming environment for responsible cannabis discussion in {cityName}.
              </p>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-semibold text-green-400 mb-3">Always Updated</h4>
              <p className="text-green-100">
                Latest information and news relevant to the {cityName} cannabis community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
