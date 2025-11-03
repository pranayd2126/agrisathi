// import React, { useState, useEffect } from 'react'
// import API from '../api'
// import { WiThermometer, WiHumidity, WiStrongWind, WiRain, WiDaySunny } from 'react-icons/wi'

// export default function WeatherPage() {
//   const [city, setCity] = useState('Hyderabad')
//   const [weather, setWeather] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [rainPrediction, setRainPrediction] = useState(null)
//   const [predictionLoading, setPredictionLoading] = useState(false)

//   async function fetchWeather(q) {
//     setLoading(true)
//     try {
//       const resp = await API.get('/utils/weather', { params: { q: q || city } })
//       const data = resp.data
//       setWeather(data)
//       console.log(data)

//       // Automatically fetch rain prediction when weather is loaded
//       fetchRainPrediction(data)
//     } catch (err) {
//       console.error(err)
//       alert('Failed to fetch weather')
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function fetchRainPrediction(weatherData) {
//     setPredictionLoading(true)
//     try {
//       // ✅ Using API.post instead of fetch
//       const response = await API.post('/ml/rain-prediction', {
//         city: weatherData.name,
//         currentWeather: {
//           temp: weatherData.main.temp,
//           humidity: weatherData.main.humidity,
//           pressure: weatherData.main.pressure,
//           windSpeed: weatherData.wind.speed,
//           condition: weatherData.weather[0].main,
//           description: weatherData.weather[0].description
//         }
//       })

//       setRainPrediction(response.data)
//     } catch (err) {
//       console.error('Rain prediction error:', err)
//       setRainPrediction({ error: 'Failed to get rain prediction. Please try again.' })
//     } finally {
//       setPredictionLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchWeather(city)
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50 py-10 px-6 md:px-12">
//       <h2 className="text-4xl font-extrabold text-green-700 mb-10 text-center drop-shadow-md">
//         🌤️ Weather Intelligence
//       </h2>

//       {/* Search Section */}
//       <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
//         <input
//           value={city}
//           onChange={e => setCity(e.target.value)}
//           className="border-2 border-green-300 bg-white rounded-xl px-5 py-3 shadow focus:outline-none focus:ring-4 focus:ring-green-200 transition w-full sm:w-72 text-gray-700"
//           placeholder="Enter city name..."
//         />
//         <button
//           onClick={() => fetchWeather(city)}
//           className={`${
//             loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//           } text-white px-8 py-3 rounded-xl shadow-md font-semibold tracking-wide transition w-full sm:w-auto`}
//           disabled={loading}
//         >
//           {loading ? 'Loading...' : 'Get Weather'}
//         </button>
//       </div>

//       {weather && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
//           {/* Main Weather Card */}
//           <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
//             <img
//               src={`http://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
//               alt={weather.weather?.[0]?.description}
//               className="w-32 h-32 mb-2"
//             />
//             <h3 className="text-2xl font-bold text-green-700 mt-2">
//               {weather.name}, {weather.sys?.country}
//             </h3>
//             <p className="text-lg mt-1 capitalize text-gray-600">
//               {weather.weather?.[0]?.main} ({weather.weather?.[0]?.description})
//             </p>
//             <p className="text-5xl font-extrabold mt-3 text-green-800">
//               {weather.main?.temp}°C
//             </p>
//             <p className="mt-2 text-gray-500">Feels like: {weather.main?.feels_like}°C</p>
//           </div>

//           {/* Detailed Info */}
//           <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
//             <h3 className="text-2xl font-bold mb-4 text-green-700">
//               Weather Details
//             </h3>
//             <div className="flex flex-col gap-3 text-gray-700">
//               <div className="flex items-center gap-2">
//                 <WiThermometer className="text-red-500" size={24}/>
//                 Temperature: <span className="font-semibold">{weather.main?.temp}°C</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <WiThermometer className="text-orange-500" size={24}/>
//                 Feels Like: {weather.main?.feels_like}°C
//               </div>
//               <div className="flex items-center gap-2">
//                 <WiThermometer className="text-red-600" size={24}/>
//                 Min / Max: {weather.main?.temp_min} / {weather.main?.temp_max}°C
//               </div>
//               <div className="flex items-center gap-2">
//                 <WiHumidity className="text-blue-500" size={24}/>
//                 Humidity: {weather.main?.humidity}%
//               </div>
//               <div className="flex items-center gap-2">
//                 <WiStrongWind className="text-green-500" size={24}/>
//                 Wind: {weather.wind?.speed} m/s
//               </div>
//               <p>Pressure: {weather.main?.pressure} hPa</p>
//               <p>
//                 Condition: {weather.weather?.[0]?.main} ({weather.weather?.[0]?.description})
//               </p>
//             </div>
//           </div>

//           {/* AI Rain Prediction Section */}
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg p-6 md:p-8 border border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
//             <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
//               <WiRain className="text-blue-600" size={32}/>
//               7-Day Rain Forecast
//             </h3>

//             {predictionLoading ? (
//               <div className="flex flex-col items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
//                 <p className="mt-4 text-blue-600 font-semibold">Analyzing weather patterns...</p>
//               </div>
//             ) : rainPrediction?.error ? (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
//                 <p className="font-semibold">⚠️ {rainPrediction.error}</p>
//               </div>
//             ) : rainPrediction?.forecast ? (
//               <div className="space-y-4">
//                 {/* Overall Summary */}
//                 <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
//                   <p className="text-sm text-gray-700 leading-relaxed">
//                     {rainPrediction.summary}
//                   </p>
//                 </div>

//                 {/* Daily Forecast */}
//                 <div className="space-y-3">
//                   {rainPrediction.forecast.map((day, index) => (
//                     <div 
//                       key={index}
//                       className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 hover:border-blue-300 transition"
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="font-bold text-blue-700">{day.day}</h4>
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           day.rainChance >= 70 ? 'bg-blue-600 text-white' :
//                           day.rainChance >= 40 ? 'bg-yellow-500 text-white' :
//                           'bg-green-500 text-white'
//                         }`}>
//                           {day.rainChance}% Rain
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600">{day.condition}</p>
//                       {day.advice && (
//                         <p className="text-xs text-green-700 mt-2 bg-green-50 p-2 rounded">
//                           💡 {day.advice}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Farming Recommendations */}
//                 {rainPrediction.farmingAdvice && (
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
//                     <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
//                       🌾 Farming Recommendations
//                     </h4>
//                     <p className="text-sm text-gray-700 leading-relaxed">
//                       {rainPrediction.farmingAdvice}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ) : null}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




import React, { useState, useEffect } from 'react'
import API from '../api'
import { WiThermometer, WiHumidity, WiStrongWind, WiRain } from 'react-icons/wi'

export default function WeatherPage() {
  const [city, setCity] = useState('Hyderabad')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rainPrediction, setRainPrediction] = useState(null)
  const [predictionLoading, setPredictionLoading] = useState(false)

  async function fetchWeather(q) {
    setLoading(true)
    try {
      const resp = await API.get('/utils/weather', { params: { q: q || city } })
      const data = resp.data
      setWeather(data)
      console.log('Weather data:', data)

      // Automatically fetch rain prediction when weather is loaded
      fetchRainPrediction(data)
    } catch (err) {
      console.error('Weather fetch error:', err)
      alert('Failed to fetch weather')
      setWeather(null)
      setRainPrediction(null)
    } finally {
      setLoading(false)
    }
  }

  async function fetchRainPrediction(weatherData) {
    setPredictionLoading(true)

    // Fallback if weather data is missing
    if (!weatherData || !weatherData.main || !weatherData.weather || !weatherData.wind) {
      setRainPrediction({ error: 'Incomplete weather data. Cannot predict rain.' })
      setPredictionLoading(false)
      return
    }

    try {
      const response = await API.post('/ml/rain-prediction', {
        city: weatherData.name || city,
        currentWeather: {
          temp: weatherData.main.temp ?? 25,
          humidity: weatherData.main.humidity ?? 50,
          pressure: weatherData.main.pressure ?? 1010,
          windSpeed: weatherData.wind.speed ?? 2,
          condition: weatherData.weather[0]?.main ?? 'Clear',
          description: weatherData.weather[0]?.description ?? 'Clear sky'
        }
      })

      setRainPrediction(response.data)
      console.log('Rain prediction:', response.data)
    } catch (err) {
      console.error('Rain prediction error:', err)
      setRainPrediction({ error: 'Failed to get rain prediction. Please try again.' })
    } finally {
      setPredictionLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50 py-10 px-6 md:px-12">
      <h2 className="text-4xl font-extrabold text-green-700 mb-10 text-center drop-shadow-md">
        🌤️ Weather Intelligence
      </h2>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          className="border-2 border-green-300 bg-white rounded-xl px-5 py-3 shadow focus:outline-none focus:ring-4 focus:ring-green-200 transition w-full sm:w-72 text-gray-700"
          placeholder="Enter city name..."
        />
        <button
          onClick={() => fetchWeather(city)}
          className={`${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-3 rounded-xl shadow-md font-semibold tracking-wide transition w-full sm:w-auto`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Main Weather Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
              alt={weather.weather?.[0]?.description}
              className="w-32 h-32 mb-2"
            />
            <h3 className="text-2xl font-bold text-green-700 mt-2">
              {weather.name}, {weather.sys?.country}
            </h3>
            <p className="text-lg mt-1 capitalize text-gray-600">
              {weather.weather?.[0]?.main} ({weather.weather?.[0]?.description})
            </p>
            <p className="text-5xl font-extrabold mt-3 text-green-800">
              {weather.main?.temp}°C
            </p>
            <p className="mt-2 text-gray-500">Feels like: {weather.main?.feels_like}°C</p>
          </div>

          {/* Detailed Info */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-green-700">Weather Details</h3>
            <div className="flex flex-col gap-3 text-gray-700">
              <div className="flex items-center gap-2"><WiThermometer className="text-red-500" size={24}/>Temperature: <span className="font-semibold">{weather.main?.temp}°C</span></div>
              <div className="flex items-center gap-2"><WiThermometer className="text-orange-500" size={24}/>Feels Like: {weather.main?.feels_like}°C</div>
              <div className="flex items-center gap-2"><WiThermometer className="text-red-600" size={24}/>Min / Max: {weather.main?.temp_min} / {weather.main?.temp_max}°C</div>
              <div className="flex items-center gap-2"><WiHumidity className="text-blue-500" size={24}/>Humidity: {weather.main?.humidity}%</div>
              <div className="flex items-center gap-2"><WiStrongWind className="text-green-500" size={24}/>Wind: {weather.wind?.speed} m/s</div>
              <p>Pressure: {weather.main?.pressure} hPa</p>
              <p>Condition: {weather.weather?.[0]?.main} ({weather.weather?.[0]?.description})</p>
            </div>
          </div>

          {/* AI Rain Prediction Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg p-6 md:p-8 border border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
              <WiRain className="text-blue-600" size={32}/>7-Day Rain Forecast
            </h3>

            {predictionLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-blue-600 font-semibold">Analyzing weather patterns...</p>
              </div>
            ) : rainPrediction?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p className="font-semibold">⚠️ {rainPrediction.error}</p>
              </div>
            ) : rainPrediction?.forecast ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{rainPrediction.summary}</p>
                </div>
                <div className="space-y-3">
                  {rainPrediction.forecast.map((day, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-blue-700">{day.day}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          day.rainChance >= 70 ? 'bg-blue-600 text-white' :
                          day.rainChance >= 40 ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>{day.rainChance}% Rain</span>
                      </div>
                      <p className="text-sm text-gray-600">{day.condition}</p>
                      {day.advice && <p className="text-xs text-green-700 mt-2 bg-green-50 p-2 rounded">💡 {day.advice}</p>}
                    </div>
                  ))}
                </div>
                {rainPrediction.farmingAdvice && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">🌾 Farming Recommendations</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{rainPrediction.farmingAdvice}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No rain prediction available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
