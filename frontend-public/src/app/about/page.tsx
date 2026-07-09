import { Metadata } from 'next';
import { Mountain, Calendar, Users, Globe, Heart, Star } from 'lucide-react';
import { getStats } from '@/lib/server-api';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Monastery360 — our mission to preserve and share the rich cultural heritage of Sikkim\'s monasteries through immersive digital experiences.',
  openGraph: {
    title: 'About Monastery360',
    description: 'Learn about Monastery360 — our mission to preserve and share the rich cultural heritage of Sikkim\'s monasteries through immersive digital experiences.',
  },
};

// ISR: revalidate every hour
export const revalidate = 3600;

export default async function AboutPage() {
  // Fetch stats server-side (single request, no pagination loop)
  let monasteryCount = 200; // fallback
  let tourCount = 15; // fallback
  try {
    const stats = await getStats(3600);
    monasteryCount = stats.monasteries;
    tourCount = stats.tours;
  } catch (e) {
    console.error('[AboutPage] Failed to fetch monastery stats:', e);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About Monastery360
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover the spiritual heritage and cultural treasures of Sikkim&apos;s sacred monasteries 
              through immersive digital experiences that bridge ancient wisdom with modern technology.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Monastery360 is dedicated to preserving and sharing the rich cultural heritage 
                of Sikkim&apos;s monasteries through innovative digital storytelling. We believe that 
                sacred spaces and ancient wisdom should be accessible to all, regardless of 
                geographical boundaries.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Through immersive 360° virtual tours, detailed cultural documentation, and 
                interactive experiences, we aim to foster deeper understanding and appreciation 
                for Buddhist philosophy, Himalayan architecture, and the spiritual traditions 
                that have flourished in these sacred spaces for centuries.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg p-8 h-64 flex items-center justify-center">
                <div className="text-center">
                  <Mountain className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Preserving Sacred Heritage
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connecting ancient wisdom with digital innovation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Virtual Accessibility
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Experience sacred monasteries from anywhere in the world through immersive 
              360° virtual tours that capture the essence of these spiritual spaces.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Cultural Calendar
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Stay connected with the rhythms of monastic life through our comprehensive 
              festival calendar featuring traditional celebrations and ceremonies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Community Learning
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Foster cross-cultural understanding and spiritual growth through shared 
              experiences and educational content about Buddhist traditions.
            </p>
          </div>
        </div>

        {/* Sikkim Heritage Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12 transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            The Heritage of Sikkim
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                A Land of Sacred Mountains
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Nestled in the Eastern Himalayas, Sikkim is a mystical land where ancient 
                Tibetan Buddhism has flourished for over 400 years. The state is home to 
                more than 200 monasteries, each serving as a beacon of spiritual wisdom 
                and cultural preservation.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These sacred institutions are not just places of worship, but repositories 
                of art, literature, philosophy, and traditional knowledge that have been 
                passed down through generations of monks and spiritual practitioners.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Architectural Marvels
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Sikkimese monasteries showcase unique architectural styles that blend 
                Tibetan, Bhutanese, and local influences. From the ancient Dubdi Monastery 
                to the magnificent Rumtek Monastery, each structure tells a story of 
                spiritual devotion and artistic excellence.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The intricate woodwork, vibrant murals, and sacred artifacts found within 
                these monasteries represent centuries of artistic tradition and religious symbolism.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {monasteryCount}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Monasteries Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">400+</div>
              <div className="text-gray-600 dark:text-gray-400">Years of Buddhist Heritage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-gray-600 dark:text-gray-400">Major Buddhist Schools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {tourCount}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Featured Virtual Tours</div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12 transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Technology Meets Tradition
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3D Mapping</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced photogrammetry and 3D scanning technologies capture every detail 
                of monastery architecture and sacred artifacts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Web VR</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cutting-edge web technologies deliver immersive virtual reality experiences 
                accessible from any device with a web browser.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Mobile First</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Responsive design ensures that spiritual exploration is possible on 
                smartphones, tablets, and desktop computers alike.
              </p>
            </div>
          </div>
        </div>

        {/* Team & Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Connect With Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Educational Partnerships
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We collaborate with monasteries, cultural institutions, and educational 
                organizations to ensure authentic representation and respectful documentation 
                of sacred traditions.
              </p>
              <div className="flex items-center space-x-4">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-gray-600 dark:text-gray-400">Built with respect for sacred traditions</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Get Involved
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Whether you&apos;re a researcher, educator, spiritual seeker, or technology 
                enthusiast, there are many ways to contribute to preserving and sharing 
                Sikkim&apos;s monastic heritage.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">Contribute historical information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">Share festival photography</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">Support conservation efforts</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For collaborations, educational partnerships, or more information about our mission:
            </p>
            <a 
              href="mailto:info@monastery360.com" 
              className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
