import React from 'react';
import Link from 'next/link';

interface Params {
  city: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);

  return {
    title: Cannabis in {cityName} | GreenBritain.Club,
    description: Find the best cannabis information and community in {cityName}. Join GreenBritain.Club for local cannabis news, reviews, and connections.,
  };
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
            Cannabis in <span className="text-green-400">{cityName}</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
            Welcome to your local cannabis community hub for {cityName}. 
            Connect, learn, and stay informed about cannabis culture in your area.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-3">Community</h3>
              <p className="text-gray-300">
                Connect with cannabis enthusiasts in {cityName} through our 
                vibrant community platform.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-3">Latest News</h3>
              <p className="text-gray-300">
                Stay updated with cannabis news and developments specific to 
                {cityName}.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-3">Events</h3>
              <p className="text-gray-300">
                Discover cannabis-related events and meetups happening in 
                {cityName}.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Why Choose GreenBritain.Club in {cityName}?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-green-400 text-xl"></div>
                  <p className="text-gray-300">
                    Built by and for cannabis enthusiasts in {cityName} and 
                    across the UK.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-400 text-xl"></div>
                  <p className="text-gray-300">
                    A welcoming environment for responsible cannabis discussion 
                    in {cityName}.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-400 text-xl"></div>
                  <p className="text-gray-300">
                    Latest information and news relevant to the {cityName} 
                    cannabis community.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-green-400 text-xl"></div>
                  <p className="text-gray-300">
                    Connect with like-minded individuals in your area.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-400 text-xl"></div>
                  <p className="text-gray-300">
                    Access to educational resources and harm reduction information.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-400 text-xl"></div>
                  <p className="text-gray-300">
                    Stay informed about local cannabis laws and regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/telegram"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Join Our {cityName} Community
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
               Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
