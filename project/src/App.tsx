import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TripPlannerPage from './pages/TripPlannerPage';
import MemoryGalleryPage from './pages/MemoryGalleryPage';
import BudgetSplitterPage from './pages/BudgetSplitterPage';
import DestinationsPage from './pages/DestinationsPage';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/plan-trip" element={<TripPlannerPage />} />
                <Route path="/memories" element={<MemoryGalleryPage />} />
                <Route path="/budget" element={<BudgetSplitterPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;