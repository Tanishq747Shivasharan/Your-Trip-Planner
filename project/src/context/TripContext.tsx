import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  type: 'solo' | 'couple' | 'friends';
  budget: number;
  status: 'planning' | 'ongoing' | 'completed';
  image: string;
  participants?: number;
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  selectTrip: (trip: Trip) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Tokyo Adventure',
      destination: 'Tokyo, Japan',
      startDate: '2024-03-15',
      endDate: '2024-03-22',
      type: 'couple',
      budget: 3000,
      status: 'planning',
      image: 'https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg?auto=compress&cs=tinysrgb&w=400',
      participants: 2
    },
    {
      id: '2',
      title: 'European Backpacking',
      destination: 'Paris, France',
      startDate: '2024-05-01',
      endDate: '2024-05-14',
      type: 'friends',
      budget: 2500,
      status: 'completed',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
      participants: 4
    }
  ]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString()
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const updateTrip = (id: string, updatedTrip: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, ...updatedTrip } : trip
    ));
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const selectTrip = (trip: Trip) => {
    setCurrentTrip(trip);
  };

  const value: TripContextType = {
    trips,
    currentTrip,
    addTrip,
    updateTrip,
    deleteTrip,
    selectTrip
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};