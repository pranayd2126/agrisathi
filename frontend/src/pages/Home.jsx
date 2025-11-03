//original 1

// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function Home(){
//   return (
//     <div className="space-y-6">
//       <header className="bg-white p-6 rounded shadow">
//         <h1 className="text-2xl font-bold">Welcome to Agrisathi</h1>
//         <p className="text-gray-600 mt-2">AI-powered platform connecting farmers with buyers and intelligent advisories.</p>
//       </header>

//       <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card title="Disease Detection" to="/disease">Upload crop images and get instant diagnosis & treatment advice.</Card>
//         <Card title="Crop Price Forecast" to="/price">View predicted mandi prices using historical data.</Card>
//         <Card title="Weather" to="/weather">Live weather for your location to plan irrigation & activities.</Card>
//       </section>

//       <section className="bg-white p-6 rounded shadow">
//         <h2 className="font-semibold">Quick Actions</h2>
//         <div className="flex gap-3 mt-4">
//           <Link to="/marketplace" className="px-4 py-2 bg-green-600 text-white rounded">Go to Marketplace</Link>
//           <Link to="/schemes" className="px-4 py-2 bg-blue-600 text-white rounded">View Schemes</Link>
//         </div>
//       </section>
//     </div>
//   )
// }

// function Card({title, children, to}){
//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <h3 className="font-bold">{title}</h3>
//       <p className="text-sm text-gray-600 mt-2">{children}</p>
//       <div className="mt-4">
//         <Link to={to} className="text-green-700 font-medium">Open →</Link>
//       </div>
//     </div>
//   )
// }

//original 2
// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function Home() {
//   return (
//     <div className="space-y-8 p-10 bg-gradient-to-r from-green-100 to-blue-50 min-h-screen">
      
//       {/* Header */}
//       <header className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-green-500">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">Welcome to Agrisathi</h1>
//         <p className="text-gray-700 mt-3 md:mt-4 max-w-2xl">
//           AI-powered platform connecting farmers with buyers and intelligent advisories.
//         </p>
//       </header>

//       {/* Main Features */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card
//           title="Disease Detection"
//           to="/disease"
//           color="from-red-400 to-red-200"
//         >
//           Upload crop images and get instant diagnosis & treatment advice.
//         </Card>

//         <Card
//           title="Crop Price Forecast"
//           to="/price"
//           color="from-yellow-400 to-yellow-200"
//         >
//           View predicted mandi prices using historical data.
//         </Card>

//         <Card
//           title="Weather"
//           to="/weather"
//           color="from-blue-400 to-blue-200"
//         >
//           Live weather for your location to plan irrigation & activities.
//         </Card>
//       </section>

//       {/* Quick Actions */}
//       <section className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-indigo-500">
//         <h2 className="font-semibold text-xl text-indigo-700">Quick Actions</h2>
//         <div className="flex flex-wrap gap-4 mt-5">
//           <Link
//             to="/marketplace"
//             className="px-5 py-3 bg-green-600 hover:bg-green-700 transition text-white rounded-lg shadow-md font-medium"
//           >
//             Go to Marketplace
//           </Link>
//           <Link
//             to="/schemes"
//             className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg shadow-md font-medium"
//           >
//             View Schemes
//           </Link>
//         </div>
//       </section>
//     </div>
//   )
// }

// // Individual Card component
// function Card({ title, children, to, color }) {
//   return (
//     <div
//       className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg hover:scale-105 transition transform duration-300 border-l-4 border-green-700`}
//     >
//       <h3 className="font-bold text-xl text-gray-800">{title}</h3>
//       <p className="text-gray-700 mt-3">{children}</p>
//       <div className="mt-5">
//         <Link
//           to={to}
//           className="text-white font-medium bg-green-600 px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
//         >
//           Open →
//         </Link>
//       </div>
//     </div>
//   )
// }


import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf, FaChartLine, FaCloudSun } from 'react-icons/fa'
import { GiFarmer } from 'react-icons/gi'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <header className="bg-white p-10 md:p-10 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 leading-tight">
              Welcome to Agrisathi
            </h1>
            <p className="mt-4 text-gray-700 text-lg md:text-xl">
              AI-powered platform connecting farmers with buyers and intelligent advisories.
            </p>
            {!isLoggedIn && (
              <div className="mt-6 flex gap-4">
                <Link to="/signup" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md font-medium text-lg">
                  Get Started - Sign Up
                </Link>
                <Link to="/join" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-medium text-lg">
                  Login
                </Link>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center justify-center">
            <GiFarmer size={120} className="text-green-400" />
          </div>
        </header>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            title="Disease Detection"
            to="http://127.0.0.1:5500/0.FARMER_bot/index.html"
            icon={<FaLeaf size={40} className="text-green-500" />}
          >
            Upload crop images and get instant diagnosis & treatment advice.
          </Card>

          <Card
            title="Crop Planner"
            to="/price"
            icon={<FaChartLine size={40} className="text-green-500" />}
          >
            View predicted mandi prices using historical data.
          </Card>

          <Card
            title="Weather"
            to="/weather"
            icon={<FaCloudSun size={40} className="text-green-500" />}
          >
            Live weather for your location to plan irrigation & activities.
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border-l-8 border-indigo-500">
          <h2 className="font-semibold text-2xl md:text-3xl text-indigo-700">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to="/marketplace"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 transition text-white rounded-lg shadow-md font-medium text-lg flex items-center gap-2"
            >
              <FaLeaf /> Go to Marketplace
            </Link>
            <Link
              to="/schemes"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg shadow-md font-medium text-lg flex items-center gap-2"
            >
              <FaChartLine /> View Schemes
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

// Individual Card component
function Card({ title, children, to, icon }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 transition transform duration-300 border-l-4 border-green-500 flex flex-col justify-between">
      <div className="flex items-center gap-4">
        {icon}
        <h3 className="font-bold text-2xl text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-700 mt-4 text-lg">{children}</p>
      <div className="mt-6">
        <Link
          to={to}
          className="text-white font-medium bg-green-600 px-5 py-3 rounded-lg shadow hover:bg-green-700 transition text-lg flex items-center justify-center"
        >
          Open →
        </Link>
      </div>
    </div>
  )
}
