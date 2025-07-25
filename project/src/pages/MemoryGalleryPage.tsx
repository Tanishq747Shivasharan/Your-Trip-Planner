import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  Heart, 
  Share2, 
  Download, 
  Plus,
  X,
  MapPin,
  Calendar,
  Filter,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface Memory {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string;
  trip: string;
  description: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
}

const MemoryGalleryPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const memories: Memory[] = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Tokyo Skytree at Sunset',
      location: 'Tokyo, Japan',
      date: '2024-03-15',
      trip: 'Tokyo Adventure',
      description: 'The most breathtaking view of Tokyo from the Skytree observation deck during golden hour.',
      tags: ['sunset', 'skyline', 'tokyo', 'architecture'],
      likes: 24,
      isLiked: true
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Balinese Rice Terraces',
      location: 'Ubud, Bali',
      date: '2024-02-20',
      trip: 'Bali Escape',
      description: 'Ancient rice terraces carved into the hillsides, showcasing traditional Balinese agriculture.',
      tags: ['nature', 'agriculture', 'bali', 'landscape'],
      likes: 18,
      isLiked: false
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Eiffel Tower Magic',
      location: 'Paris, France',
      date: '2024-01-10',
      trip: 'European Backpacking',
      description: 'The iconic Eiffel Tower sparkling with lights during our romantic evening stroll.',
      tags: ['paris', 'romance', 'architecture', 'evening'],
      likes: 32,
      isLiked: true
    },
    {
      id: '4',
      image: 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Maldivian Paradise',
      location: 'Maldives',
      date: '2023-12-05',
      trip: 'Honeymoon Bliss',
      description: 'Crystal clear waters and overwater bungalows in this tropical paradise.',
      tags: ['beach', 'tropical', 'maldives', 'paradise'],
      likes: 45,
      isLiked: true
    },
    {
      id: '5',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Colosseum Glory',
      location: 'Rome, Italy',
      date: '2023-11-22',
      trip: 'Italian Adventure',
      description: 'Standing in awe before this ancient amphitheater, imagining the gladiators of old.',
      tags: ['history', 'rome', 'ancient', 'architecture'],
      likes: 28,
      isLiked: false
    },
    {
      id: '6',
      image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Santorini Sunset',
      location: 'Oia, Santorini',
      date: '2023-10-15',
      trip: 'Greek Island Hopping',
      description: 'The world-famous Santorini sunset from Oia, painting the sky in brilliant oranges and pinks.',
      tags: ['sunset', 'santorini', 'greece', 'romantic'],
      likes: 52,
      isLiked: true
    }
  ];

  const trips = ['all', 'Tokyo Adventure', 'Bali Escape', 'European Backpacking', 'Honeymoon Bliss', 'Italian Adventure', 'Greek Island Hopping'];

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTrip = selectedTrip === 'all' || memory.trip === selectedTrip;
    
    return matchesSearch && matchesTrip;
  });

  const toggleLike = (memoryId: string) => {
    // In a real app, this would update the backend
    console.log('Toggling like for memory:', memoryId);
  };

  const UploadModal = () => (
    <AnimatePresence>
      {isUploadModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Memory</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop your photos here or click to browse</p>
              <p className="text-sm text-gray-500">Supports JPG, PNG, GIF up to 10MB</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Files
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Give your memory a title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Where was this taken?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {trips.slice(1).map(trip => (
                    <option key={trip} value={trip}>{trip}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all">
                Upload Memory
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const MemoryModal = () => (
    <AnimatePresence>
      {selectedMemory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-2/3 relative">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  className="w-full h-64 md:h-full object-cover"
                />
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="md:w-1/3 p-6 overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMemory.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{selectedMemory.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(selectedMemory.date), 'MMMM dd, yyyy')}</span>
                </div>
                
                <p className="text-gray-700 mb-6">{selectedMemory.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedMemory.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toggleLike(selectedMemory.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedMemory.isLiked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${selectedMemory.isLiked ? 'fill-current' : ''}`} />
                    <span>{selectedMemory.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to view your memories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Memory Gallery</h1>
            <p className="text-gray-600">Relive your adventures through beautiful moments captured in time</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Memory</span>
          </button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search memories, locations, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {trips.map(trip => (
                  <option key={trip} value={trip}>
                    {trip === 'all' ? 'All Trips' : trip}
                  </option>
                ))}
              </select>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Memory Gallery */}
        {filteredMemories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-500 mb-2">No memories found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedTrip !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'Start capturing and uploading your travel memories!'
              }
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105"
            >
              Add Your First Memory
            </button>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
          }>
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => setSelectedMemory(memory)}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(memory.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        memory.isLiked
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${memory.isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{memory.title}</h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{memory.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{format(new Date(memory.date), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {viewMode === 'list' && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{memory.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{memory.likes} likes</span>
                    </div>
                    <span className="text-xs text-gray-400">{memory.trip}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <UploadModal />
      <MemoryModal />
      <Footer />
    </div>
  );
};

export default MemoryGalleryPage;