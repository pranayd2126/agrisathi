import React, { useState, useEffect } from 'react';

export default function AuthDebug() {
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT (basic decoding, not verification)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        setTokenInfo({
          exists: true,
          decoded,
          isExpired,
          expiresAt: new Date(decoded.exp * 1000).toLocaleString()
        });
      } catch (e) {
        setTokenInfo({ exists: true, error: 'Invalid token format' });
      }
    } else {
      setTokenInfo({ exists: false });
    }
  }, []);

  const clearToken = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (!tokenInfo) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      {/* <h3 className="text-xl font-bold mb-4">Auth Debug Info</h3> */}
      
      {tokenInfo.exists ? (
        <div className="space-y-2">
          {/* <p className="text-green-600 font-semibold">✅ Token exists in localStorage</p> */}
          
          {tokenInfo.error ? (
            <p className="text-red-600">❌ {tokenInfo.error}</p>
          ) : (
            <>
              <p>User ID: {tokenInfo.decoded.id}</p>
              <p>Email: {tokenInfo.decoded.email}</p>
              <p>Role: {tokenInfo.decoded.role}</p>
              <p>Expires: {tokenInfo.expiresAt}</p>
              <p className={tokenInfo.isExpired ? 'text-red-600' : 'text-green-600'}>
                {tokenInfo.isExpired ? '❌ Token EXPIRED' : '✅ Token valid'}
              </p>
            </>
          )}
          
          <button 
            onClick={clearToken}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Token & Reload
          </button>
        </div>
      ) : (
        <p className="text-red-600">❌ No token found - Please login</p>
      )}
    </div>
  );
}
