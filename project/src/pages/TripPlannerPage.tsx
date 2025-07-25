import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  User, 
  Heart, 
  ArrowRight,
  ArrowLeft,
  Save,
  Plane
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

const TripPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTrip } = useTrip();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    type: (searchParams.get('type') as 'solo' | 'couple' | 'friends') || 'solo',
    budget: 1000,
    participants: 1
  });

  const totalSteps = 4;

  const destinations = [
    {
      name: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Modern city with ancient traditions',
      estimatedBudget: { solo: 2500, couple: 4000, friends: 3000 }
    },
    {
      name: 'Paris, France',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'City of lights and romance',
      estimatedBudget: { solo: 2000, couple: 3500, friends: 2800 }
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tropical paradise with rich culture',
      estimatedBudget: { solo: 1500, couple: 2500, friends: 2000 }
    },
    {
      name: 'New York, USA',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'The city that never sleeps',
      estimatedBudget: { solo: 3000, couple: 5000, friends: 4000 }
    },
    {
      name: 'Rome, Italy',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Eternal city of history and art',
      estimatedBudget: { solo: 1800, couple: 3200, friends: 2600 }
    },
    {
      name: 'Bangkok, Thailand',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Vibrant street life and temples',
      estimatedBudget: { solo: 1200, couple: 2000, friends: 1600 }
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const selectedDestination = destinations.find(d => d.name === tripData.destination);
    
    addTrip({
      ...tripData,
      status: 'planning' as const,
      image: selectedDestination?.image || destinations[0].image
    });
    
    navigate('/dashboard');
  };

  const getTripTypeIcon = (type: string) => {
    switch (type) {
      case 'solo':
        return User;
      case 'couple':
        return Heart;
      case 'friends':
        return Users;
      default:
        return User;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Travel Style</h2>
              <p className="text-gray-600">How would you like to explore the world?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { type: 'solo', label: 'Solo Adventure', icon: User, description: 'Perfect for self-discovery' },
                { type: 'couple', label: 'Romantic Getaway', icon: Heart, description: 'Intimate experiences together' },
                { type: 'friends', label: 'Group Adventure', icon: Users, description: 'Fun with your crew' }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={option.type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTripData({ ...tripData, type: option.type as any })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      tripData.type === option.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                        tripData.type === option.type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.label}</h3>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Where Would You Like to Go?</h2>
              <p className="text-gray-600">Choose from our curated destinations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <motion.div
                  key={destination.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTripData({ 
                      ...tripData, 
                      destination: destination.name,
                      budget: destination.estimatedBudget[tripData.type]
                    });
                  }}
                  className={`rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    tripData.destination === destination.name
                      ? 'ring-4 ring-blue-500'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="relative h-48">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm opacity-90">{destination.description}</p>
                    </div>
                    {tripData.destination === destination.name && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estimated budget</span>
                      <span className="text-lg font-bold text-green-600">
                        ${destination.estimatedBudget[tripData.type].toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Trip Details</h2>
              <p className="text-gray-600">When are you planning to travel?</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Title
                </label>
                <input
                  type="text"
                  value={tripData.title}
                  onChange={(e) => setTripData({ ...tripData, title: e.target.value })}
                  placeholder="Give your trip a memorable name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tripData.startDate}
                    onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tripData.endDate}
                    onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {tripData.type === 'friends' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Participants
                  </label>
                  <select
                    value={tripData.participants}
                    onChange={(e) => setTripData({ ...tripData, participants: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} people</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Budget Planning</h2>
              <p className="text-gray-600">Set your budget for this adventure</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={tripData.budget}
                    onChange={(e) => setTripData({ ...tripData, budget: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="mt-2">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={tripData.budget}
                    onChange={(e) => setTripData({ ...tripData, budget: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$500</span>
                    <span>$10,000</span>
                  </div>
                </div>
              </div>

              {tripData.type === 'friends' && tripData.participants > 1 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Budget Breakdown</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Per person:</span>
                      <span className="font-semibold">${Math.round(tripData.budget / tripData.participants).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total participants:</span>
                      <span className="font-semibold">{tripData.participants} people</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trip Type:</span>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getTripTypeIcon(tripData.type), { className: "h-4 w-4" })}
                      <span className="font-medium capitalize">{tripData.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">{tripData.destination || 'Not selected'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {tripData.startDate && tripData.endDate 
                        ? `${Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                        : 'Not set'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium text-green-600">${tripData.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return tripData.type !== '';
      case 2:
        return tripData.destination !== '';
      case 3:
        return tripData.title && tripData.startDate && tripData.endDate;
      case 4:
        return tripData.budget > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Plan Your Trip</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isStepValid()
                  ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:from-blue-700 hover:to-orange-600 transform hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="h-5 w-5" />
              <span>Create Trip</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isStepValid()
                  ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:from-blue-700 hover:to-orange-600 transform hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TripPlannerPage;