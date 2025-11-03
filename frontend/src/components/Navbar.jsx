import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const links = [
  { to: '/', label: 'Home' },
  { to: '/weather', label: 'Weather' },
  { to: '/price', label: 'Crop Plan' },
  { to: 'http://127.0.0.1:5500/0.FARMER_bot/index.html', label: 'Disease Detection' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/schemes', label: 'Schemes' },
  { to: '/profile', label: 'Profile' }
]

export default function Navbar({ user, isAuthenticated, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <span className="text-2xl font-bold">AgriSathi</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-200 transition">Home</Link>
            <Link to="http://127.0.0.1:5500/0.FARMER_bot/index.html" className="hover:text-green-200 transition">Disease Detection</Link>
            <Link to="/price" className="hover:text-green-200 transition">Crop Plan</Link>
            <Link to="/weather" className="hover:text-green-200 transition">Weather</Link>
            <Link to="/recommendations" className="hover:text-green-200 transition">Recommendations</Link>
            <Link to="/marketplace" className="hover:text-green-200 transition">Marketplace</Link>
            <Link to="/schemes" className="hover:text-green-200 transition">Schemes</Link>

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg transition"
                >
                  <FaUser />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/join" 
                className="bg-white text-green-700 hover:bg-green-50 px-6 py-2 rounded-full font-semibold transition shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl focus:outline-none"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="http://127.0.0.1:5500/0.FARMER_bot/index.html" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
              Disease Detection
            </Link>
            <Link to="/price" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
              Crop Plan
            </Link>
            <Link to="/weather" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
              Weather
            </Link>
            <Link to="/recommendations" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
              Recommendations
            </Link>
            <Link to="/marketplace" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
              Marketplace
            </Link>
            <Link to="/schemes" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
              Schemes
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block bg-green-800 hover:bg-green-900 px-4 py-2 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  👤 {user.name}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link 
                to="/join" 
                className="block bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded font-semibold transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
