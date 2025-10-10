import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import AddDestination from './pages/AddDestination';
import EditDestination from './pages/EditDestination';
import DestinationDetail from './pages/DestinationDetail';
import Favorites from './pages/Favorites';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/add-destination" element={<AddDestination />} />
            <Route path="/edit-destination/:id" element={<EditDestination />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3 className="footer-logo">🌍 Wanderly</h3>
                <p>Platform destinasi wisata terbaik untuk menemukan petualangan Anda berikutnya.</p>
              </div>
              <div className="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="/">Beranda</a></li>
                  <li><a href="/destinations">Destinasi</a></li>
                  <li><a href="/add-destination">Tambah Destinasi</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Kontak</h4>
                <p>Email: info@wanderly.com</p>
                <p>Phone: +62 123 456 789</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Wanderly. All rights reserved. Built with ❤️</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;