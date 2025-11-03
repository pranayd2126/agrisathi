//original 1
// import React, {useState} from 'react';
// import API from '../api';

// export default function PriceForecast(){
//   const [crop, setCrop] = useState('wheat');
//   const [forecast, setForecast] = useState(null);

//   async function fetchForecast(){
//     const resp = await API.get('/ml/price-forecast', { params: { crop }});
//     setForecast(resp.data.forecast);
//   }
//   return (
//     <div className="p-6">
//       <h2 className="text-xl">Price Forecast</h2>
//       <div className="mt-4">
//         <input value={crop} onChange={e=>setCrop(e.target.value)} className="border p-2"/>
//         <button onClick={fetchForecast} className="ml-2 bg-blue-600 text-white px-3 py-2 rounded">Get Forecast</button>
//       </div>
//       {forecast && (
//         <ul className="mt-4 space-y-1">
//           {forecast.map(f=> <li key={f.date}>{f.date}: ₹{f.predicted_price}</li>)}
//         </ul>
//       )}
//     </div>
//   );
// }

//original 2
// import React, { useState } from 'react';
// import API from '../api';

// export default function PriceForecast() {
//   const [crop, setCrop] = useState('wheat');
//   const [forecast, setForecast] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState(null);

//   const crops = ['wheat', 'rice', 'maize', 'cotton', 'sugarcane'];

//   async function fetchForecast() {
//     try {
//       setLoading(true);
//       setForecast(null);
//       setStats(null);

//       const resp = await API.get('/ml/price-forecast', { params: { crop } });

//       if (resp.data.forecast) {
//         setForecast(resp.data.forecast);
//         console.log('Forecast data:', resp.data.forecast);

//         // Compute simple stats
//         const prices = resp.data.forecast.map(f => f.predicted_price);
//         const minPrice = Math.min(...prices);
//         const maxPrice = Math.max(...prices);
//         const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);

//         setStats({ minPrice, maxPrice, avgPrice });
//       }
//     } catch (err) {
//       console.error('Error fetching forecast:', err);
//       alert('Failed to fetch forecast. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Crop Price Forecast 📈</h2>

//       <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
//         <select
//           value={crop}
//           onChange={e => setCrop(e.target.value)}
//           className="border border-gray-300 rounded p-2 flex-1"
//         >
//           {crops.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
//         </select>
//         <button
//           onClick={fetchForecast}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           {loading ? 'Fetching...' : 'Get Forecast'}
//         </button>
//       </div>

//       {stats && (
//         <div className="mb-4 bg-gray-50 p-4 rounded border border-gray-200">
//           <h3 className="font-semibold text-gray-700 mb-2">Forecast Summary:</h3>
//           <p>Minimum Price: <span className="font-medium">₹{stats.minPrice}</span></p>
//           <p>Maximum Price: <span className="font-medium">₹{stats.maxPrice}</span></p>
//           <p>Average Price: <span className="font-medium">₹{stats.avgPrice}</span></p>
//         </div>
//       )}

//       {forecast && (
//         <table className="w-full text-left border border-gray-200 rounded">
//           <thead className="bg-blue-100">
//             <tr>
//               <th className="px-4 py-2 border-b">Date</th>
//               <th className="px-4 py-2 border-b">Predicted Price (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {forecast.map(f => (
//               <tr key={f.date} className="hover:bg-gray-50">
//                 <td className="px-4 py-2 border-b">{f.date}</td>
//                 <td className="px-4 py-2 border-b">{f.predicted_price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {!forecast && !loading && (
//         <p className="text-gray-500 mt-2">Select a crop and click "Get Forecast" to see predictions.</p>
//       )}
//     </div>
//   );
// }



// import React, { useState } from "react";
// import API from "../api";

// export default function CropPlan() {
//   const [crop, setCrop] = useState("");
//   const [plan, setPlan] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setPlan("");

//     try {
//       const resp = await API.post("ml/get_crop_plan", { crop });
//       setPlan(resp.data.plan);
//     } catch (err) {
//       console.error(err);
//       setPlan("Unable to fetch plan. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">
//         🌱 Crop Growth Plan
//       </h2>

//       <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Enter crop name"
//           value={crop}
//           onChange={(e) => setCrop(e.target.value)}
//           required
//           className="border rounded p-2 flex-1"
//         />
//         <button
//           type="submit"
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//           disabled={loading}
//         >
//           {loading ? "Generating..." : "Get Plan"}
//         </button>
//       </form>

//       {plan && (
//         <div className="bg-green-50 p-4 rounded-lg">
//           <pre className="whitespace-pre-wrap text-gray-700">{plan}</pre>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState } from "react";

export default function CropPlanner() {
  const [crop, setCrop] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const GEMINI_API_KEY = "AIzaSyDlNYAinO0b7eZ3CbyaUVok4wQk6w-m-4g"; // <-- replace with your actual Gemini API key

  // Fallback random crop plan
  const fallbackPlans = {
    wheat: `🌾 **Fallback Wheat Plan**
1️⃣ Prepare land with 2–3 plowings.
2️⃣ Use certified wheat seeds.
3️⃣ Irrigate at 20, 40, 70, and 100 days.
4️⃣ Apply urea and DAP fertilizers.
5️⃣ Watch for rust and aphids.
6️⃣ Harvest after grains turn golden.`,

    rice: `🌾 **Fallback Rice Plan**
1️⃣ Level the field and flood before transplanting.
2️⃣ Use high-yielding varieties like IR-64.
3️⃣ Maintain 2–3 cm water depth.
4️⃣ Apply nitrogen in 3 splits.
5️⃣ Use pre-emergent herbicides for weeds.
6️⃣ Harvest when 80% grains turn golden.`,

    maize: `🌽 **Fallback Maize Plan**
1️⃣ Plow 2–3 times, ensure good drainage.
2️⃣ Apply NPK (120:60:40).
3️⃣ Irrigate every 10–12 days.
4️⃣ Watch for fall armyworms.
5️⃣ Harvest when husks dry and grains harden.`,
  };

  const getCropPlan = async () => {
    if (!crop.trim()) {
      setError("Please enter a crop name.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Provide a complete farming plan for ${crop}. Include land preparation, seed selection, irrigation, pest management, and harvesting steps in detail.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini raw response:", data);

      let textResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        fallbackPlans[crop.toLowerCase()] ||
        "⚠️ Unable to get detailed plan. Please try again.";

      setPlan(textResponse);
    } catch (err) {
      console.error("Gemini API failed:", err);
      setPlan(
        fallbackPlans[crop.toLowerCase()] ||
          "⚠️ Network or API error. Showing fallback plan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
        🌿 AI Crop Planner
      </h2>

      <input
        type="text"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        placeholder="Enter crop name (e.g., Wheat, Rice, Maize)"
        className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />

      <button
        onClick={getCropPlan}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-all"
      >
        {loading ? "Analyzing Crop Plan..." : "Get Crop Plan"}
      </button>

      {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

      {plan && (
        <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg whitespace-pre-wrap text-gray-800">
          <h3 className="font-semibold text-green-700 mb-2">
            🌾 Crop Plan for {crop}
          </h3>
          <p>{plan}</p>
        </div>
      )}
    </div>
  );
}
