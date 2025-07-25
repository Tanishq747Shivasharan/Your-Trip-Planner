import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Clock, 
  Users, 
  Heart,
  Search,
  Filter,
  Thermometer,
  Camera,
  Utensils,
  Mountain
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DestinationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const destinations = [
    {
      id: 1,
      name: 'Tokyo, Japan',
      country: 'Japan',
      image: 'https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.9,
      reviews: 2847,
      price: 2500,
      duration: '7 days',
      category: 'urban',
      description: 'Experience the perfect blend of tradition and modernity in Japan\'s bustling capital.',
      highlights: ['Tokyo Skytree', 'Senso-ji Temple', 'Shibuya Crossing', 'Cherry Blossoms'],
      bestTime: 'March - May, September - November',
      temperature: '15-25°C'
    },
    {
      id: 2,
      name: 'Paris, France',
      country: 'France',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.8,
      reviews: 3521,
      price: 2000,
      duration: '5 days',
      category: 'cultural',
      description: 'The City of Light offers romance, art, and culinary excellence at every corner.',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River Cruise'],
      bestTime: 'April - June, September - October',
      temperature: '12-22°C'
    },
    {
      id: 3,
      name: 'Bali, Indonesia',
      country: 'Indonesia',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.7,
      reviews: 1983,
      price: 1500,
      duration: '10 days',
      category: 'beach',
      description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture.',
      highlights: ['Uluwatu Temple', 'Rice Terraces', 'Beaches', 'Mount Batur'],
      bestTime: 'April - September',
      temperature: '26-30°C'
    },
    {
      id: 4,
      name: 'New York, USA',
      country: 'United States',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.6,
      reviews: 4102,
      price: 3000,
      duration: '6 days',
      category: 'urban',
      description: 'The city that never sleeps, offering world-class entertainment and iconic landmarks.',
      highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Broadway'],
      bestTime: 'April - June, September - November',
      temperature: '10-25°C'
    },
    {
      id: 5,
      name: 'Rome, Italy',
      country: 'Italy',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.8,
      reviews: 2765,
      price: 1800,
      duration: '5 days',
      category: 'cultural',
      description: 'Walk through history in the Eternal City, where ancient meets modern.',
      highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
      bestTime: 'April - June, September - October',
      temperature: '15-25°C'
    },
    {
      id: 6,
      name: 'Maldives',
      country: 'Maldives',
      image: 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.9,
      reviews: 1456,
      price: 4000,
      duration: '7 days',
      category: 'beach',
      description: 'Paradise on Earth with crystal-clear waters and overwater bungalows.',
      highlights: ['Overwater Villas', 'Coral Reefs', 'Water Sports', 'Sunset Cruises'],
      bestTime: 'November - April',
      temperature: '28-32°C'
    },
    {
      id: 7,
      name: 'Swiss Alps, Switzerland',
      country: 'Switzerland',
      image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.9,
      reviews: 987,
      price: 3500,
      duration: '8 days',
      category: 'adventure',
      description: 'Breathtaking mountain scenery with world-class skiing and hiking.',
      highlights: ['Matterhorn', 'Jungfraujoch', 'Alpine Villages', 'Scenic Trains'],
      bestTime: 'December - March, June - September',
      temperature: '-2-20°C'
    },
    {
      id: 8,
      name: 'Santorini, Greece',
      country: 'Greece',
      image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.8,
      reviews: 2134,
      price: 2200,
      duration: '6 days',
      category: 'beach',
      description: 'Iconic white-washed buildings perched on volcanic cliffs overlooking the Aegean.',
      highlights: ['Oia Sunset', 'Blue Domes', 'Volcanic Beaches', 'Wine Tasting'],
      bestTime: 'April - June, September - October',
      temperature: '18-28°C'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Destinations', icon: MapPin },
    { id: 'urban', name: 'City Breaks', icon: MapPin },
    { id: 'beach', name: 'Beach Paradise', icon: Heart },
    { id: 'cultural', name: 'Cultural Heritage', icon: Camera },
    { id: 'adventure', name: 'Adventure', icon: Mountain }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'budget', name: 'Under $2,000' },
    { id: 'mid', name: '$2,000 - $3,000' },
    { id: 'luxury', name: 'Above $3,000' }
  ];

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'budget' && destination.price < 2000) ||
                        (priceRange === 'mid' && destination.price >= 2000 && destination.price <= 3000) ||
                        (priceRange === 'luxury' && destination.price > 3000);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getPriceCategory = (price: number) => {
    if (price < 2000) return 'Budget-Friendly';
    if (price <= 3000) return 'Mid-Range';
    return 'Luxury';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing
            <span className="block bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Destinations
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore handpicked destinations from around the world, each offering unique experiences and unforgettable memories.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex-1">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-48">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                    {getPriceCategory(destination.price)}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{destination.rating}</span>
                    <span className="text-xs opacity-90">({destination.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{destination.name}</h3>
                  <div className="flex items-center space-x-1 text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">{destination.price.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Thermometer className="h-4 w-4 mr-2" />
                      <span>{destination.temperature}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Best Time:</span>
                    <span className="text-sm font-medium text-gray-700">{destination.bestTime}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-500 mb-2">No destinations found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or explore all destinations.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-xl opacity-90 mb-6">
            Found your dream destination? Let's turn it into an unforgettable journey.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Plan Your Trip
          </button>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DestinationsPage;