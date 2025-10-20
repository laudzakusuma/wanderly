// frontend/src/App.js - CLEAN CONDITIONAL RENDERING

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingVoiceButton from './components/FloatingVoiceButton';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import AddDestination from './pages/AddDestination';
import EditDestination from './pages/EditDestination';
import DestinationDetail from './pages/DestinationDetail';
import Favorites from './pages/Favorites';
import VoiceAgent from './pages/VoiceAgent';
import './App.css';

function AppContent() {
  const location = useLocation();
  
  // ✅ FIX: Conditional rendering based on route
  const isVoiceAgentPage = location.pathname === '/voice-agent';
  const hideFloatingButton = isVoiceAgentPage;

  return (
    <div className="app">
      {/* ✅ Hide Navbar on Voice Agent page */}
      {!isVoiceAgentPage && <Navbar />}
      
      <main className={`main-content ${isVoiceAgentPage ? 'voice-agent-mode' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/add-destination" element={<AddDestination />} />
          <Route path="/edit-destination/:id" element={<EditDestination />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/voice-agent" element={<VoiceAgent />} />
        </Routes>
      </main>
      
      {/* ✅ Hide Floating Voice Button on Voice Agent page */}
      {!hideFloatingButton && <FloatingVoiceButton />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;