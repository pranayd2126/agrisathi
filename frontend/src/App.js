// import React from 'react'
// import { Routes, Route } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import DiseaseDetect from './pages/DiseaseDetect'
// import PriceForecast from './pages/PriceForecast'
// import WeatherPage from './pages/Weather'
// import Recommendations from './pages/Recommendations'
// import Marketplace from './pages/Marketplace'
// import Schemes from './pages/Schemes'
// import Profile from './pages/Profile'
// import Chatbot from './components/Chatbot'
// import Footer from './pages/Footer'

// export default function App(){
//   return (
//     <div className="flex flex-col min-h-screen bg-green-50">
//       <Navbar />
//       <main>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/disease" element={<DiseaseDetect />} />
//           <Route path="/price" element={<PriceForecast />} />
//           <Route path="/weather" element={<WeatherPage />} />
//           <Route path="/recommendations" element={<Recommendations />} />
//           <Route path="/marketplace" element={<Marketplace />} />
//           <Route path="/schemes" element={<Schemes />} />
//           <Route path="/profile" element={<Profile />} />
//         </Routes>
//         <Chatbot path="/api/chatbot" pageName="Home Page" />
//       </main>
//       <Footer />
//     </div>
//   )
// }


import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DiseaseDetect from './pages/DiseaseDetect'
import WeatherPage from './pages/Weather'
import Recommendations from './pages/Recommendations'
import Marketplace from './pages/Marketplace'
import Schemes from './pages/Schemes'
import Profile from './pages/Profile'
import Chatbot from './components/Chatbot'
import Footer from './pages/Footer'
import AuthModal from './components/AuthModel.jsx'
import Signup from './pages/Signup.jsx'
import Join from './pages/Join.jsx'
import CropPlan from './pages/CropPlan.jsx'
import API from './api'

export default function App(){
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchUser();
    
    // Check token validity every 5 minutes
    const interval = setInterval(() => {
      refreshTokenIfNeeded();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const checkAuthAndFetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetchUser();
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/profile');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      if (err.response?.status === 401) {
        // Token invalid or expired
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  };

  const refreshTokenIfNeeded = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Try to refresh the token
      const res = await API.post('/auth/refresh');
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log('✅ Token refreshed successfully');
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      // Don't logout immediately, just log the error
      // The token might still be valid
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Navbar user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/join" element={<Join />} />
          <Route 
            path="/disease" 
            element={
              <DiseaseDetect 
                currentSessionId={currentSessionId} 
                setCurrentSessionId={setCurrentSessionId} 
                chatHistory={chatHistory} 
                setChatHistory={setChatHistory} 
              />
            } 
          />
          <Route path="/price" element={<CropPlan />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Chatbot path="/api/chatbot" pageName="Home Page" />
      </main>
      <Footer />
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}