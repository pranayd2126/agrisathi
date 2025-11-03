import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try{
      // ✅ Changed from '/signup' to '/auth/register'
      const res = await API.post('/auth/signup', form);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert('Account created successfully!');
        navigate('/');
        window.location.reload(); // Refresh to update navbar
      }
    }catch(err){
      console.error('Signup error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMsg);
      alert(errorMsg);
    }finally{ 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-green-800">Create Account</h2>
        <p className="text-gray-600 mb-6">Join Agrisathi to connect with buyers and get AI-powered farming insights</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              name="name" 
              placeholder="Enter your full name" 
              value={form.name} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              name="email" 
              type="email"
              placeholder="your.email@example.com" 
              value={form.email} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              name="phone" 
              placeholder="+91 9876543210" 
              value={form.phone} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="Minimum 6 characters" 
              value={form.password} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              required
              minLength={6}
            />
          </div>
          <button 
            disabled={loading} 
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold text-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/join" className="text-blue-600 hover:text-blue-700 font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  );
}
