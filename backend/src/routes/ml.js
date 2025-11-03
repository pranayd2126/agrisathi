// routes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const ML_BASE = process.env.ML_BASE_URL || 'http://localhost:5000';

// Fallbacks
const fallbackCrops = [
  { recommended_crop: "Wheat", reason: "Suitable for medium soil and seasonal conditions" },
  { recommended_crop: "Rice", reason: "Grows well in wet conditions and loamy soil" },
  { recommended_crop: "Maize", reason: "High yield crop for summer season" },
  { recommended_crop: "Tomato", reason: "Short duration crop, grows well in various soils" },
  { recommended_crop: "Sugarcane", reason: "Suitable for large land with high water availability" }
];

const fallbackPlan = {
  crop: "Wheat",
  plan: `1. Prepare the land and plow properly.
2. Sow wheat seeds in rows.
3. Water regularly and monitor moisture.
4. Apply fertilizers at recommended stages.
5. Keep an eye on pests and diseases.
6. Harvest when grains turn golden.`
};

const fallbackRainForecast = {
  city: "Unknown",
  summary: "Weather conditions appear stable with moderate chances of rain throughout the week.",
  forecast: [
    { day: "Today", rainChance: 45, condition: "Partly cloudy", advice: "Good day for light field work" },
    { day: "Tomorrow", rainChance: 50, condition: "Light showers possible", advice: "Monitor soil moisture" },
    { day: "Day 3", rainChance: 35, condition: "Mostly sunny", advice: "Ideal for spraying operations" },
    { day: "Day 4", rainChance: 60, condition: "Moderate rain expected", advice: "Postpone irrigation" },
    { day: "Day 5", rainChance: 55, condition: "Scattered showers", advice: "Ensure proper drainage" },
    { day: "Day 6", rainChance: 40, condition: "Cloudy with breaks", advice: "Resume normal activities" },
    { day: "Day 7", rainChance: 30, condition: "Clear skies", advice: "Good conditions for harvesting" }
  ],
  farmingAdvice: "Plan your farming activities based on rainfall patterns. Avoid heavy machinery during rainy days and ensure proper field drainage."
};

// Helper function to call Gemini API using axios
async function callGeminiAPI(prompt) {
  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      }
    }
  );
  return response.data;
}

// --- Disease Prediction ---
router.post('/disease', async (req, res) => {
  try {
    const resp = await axios.post(`${ML_BASE}/predict_disease`, req.body, { timeout: 120000 });
    return res.json(resp.data);
  } catch (err) {
    console.error('⚠ Disease prediction failed:', err.message);
    return res.json({
      status: 'fallback',
      disease: 'Healthy',
      severity: 'None',
      advice: 'Looks healthy. Maintain irrigation and follow recommended schedule.'
    });
  }
});

// --- Price Forecast ---
router.get('/price-forecast', async (req, res) => {
  const { crop, market } = req.query;
  try {
    const resp = await axios.get(`${ML_BASE}/forecast_price`, { params: { crop, market } });
    return res.json(resp.data);
  } catch (err) {
    console.error('⚠ Price forecast failed:', err.message);
    return res.json({
      status: 'fallback',
      crop,
      market,
      forecast: [{ date: new Date().toISOString(), predicted_price: 1200 }],
      model: 'mock'
    });
  }
});

// --- Crop Recommendation ---
router.post('/recommend_crop', async (req, res) => {
  try {
    console.log('🌾 Sending recommendation to FastAPI:', req.body);
    const resp = await axios.post(`${ML_BASE}/ml/recommend_crop`, req.body);
    return res.json(resp.data);
  } catch (err) {
    console.error('⚠ Crop recommendation failed:', err.message);
    return res.json({
      status: 'fallback',
      recommended_crop: 'Green Gram',
      confidence: 0.5
    });
  }
});

router.post("/recommend_crop_gemini", async (req, res) => {
  const { location, season, duration, soilType, waterResources, landSize, landUnit } = req.body;

  const prompt = `You are an agricultural AI assistant. Based on the following details, recommend ONE ideal crop.
Details:
- Location: ${location}
- Season: ${season}
- Duration: ${duration}
- Soil Type: ${soilType}
- Water Resources: ${waterResources}
- Land Size: ${landSize} ${landUnit}

Respond strictly in JSON format:
{ "recommended_crop": "CropName", "reason": "Short reasoning" }`;

  try {
    const data = await callGeminiAPI(prompt);
    let geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    geminiText = geminiText.trim().replace(/^```json\n?/g, "").replace(/\n?```$/g, "").trim();

    let json;
    try {
      json = JSON.parse(geminiText);
      if (!json.recommended_crop) throw new Error("Missing field");
    } catch (err) {
      console.warn("Gemini parsing failed. Using fallback crop.");
      json = fallbackCrops[Math.floor(Math.random() * fallbackCrops.length)];
    }

    res.json(json);
  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    const fallback = fallbackCrops[Math.floor(Math.random() * fallbackCrops.length)];
    res.json(fallback);
  }
});

router.post("/get_crop_plan", async (req, res) => {
  const { crop } = req.body;

  if (!crop) return res.status(400).json({ error: "Crop name is required" });

  const prompt = `You are an expert agricultural AI assistant. A farmer is growing ${crop}. 
Provide a complete step-by-step plan from preparation to harvesting. 
Include soil tips, water, fertilizer, pest control, and harvesting steps. 
Give response in 20 lines.
Respond strictly in JSON format:
{ "crop": "CropName", "plan": "Step-by-step plan here" }`;

  try {
    const data = await callGeminiAPI(prompt);
    let geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    geminiText = geminiText.trim().replace(/^```json\n?/g, "").replace(/\n?```$/g, "").trim();

    let json;
    try {
      json = JSON.parse(geminiText);
      if (!json.crop || !json.plan) throw new Error("Missing fields");
    } catch (err) {
      console.warn("Gemini parse failed, using fallback plan.");
      json = { ...fallbackPlan, crop };
    }

    res.json(json);
  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    res.json({ ...fallbackPlan, crop });
  }
});

// --- 7-Day Rain Prediction ---
router.post("/rain-prediction", async (req, res) => {
  const { city, currentWeather } = req.body;

  if (!city || !currentWeather) {
    return res.status(400).json({ error: "City and current weather data are required" });
  }

  const prompt = `You are an expert meteorologist and agricultural advisor for India. 
Based on the current weather data for ${city}, provide a detailed 7-day rain forecast with farming recommendations.

Current Weather Data:
- Temperature: ${currentWeather.temp}°C
- Humidity: ${currentWeather.humidity}%
- Pressure: ${currentWeather.pressure} hPa
- Wind Speed: ${currentWeather.windSpeed} m/s
- Condition: ${currentWeather.condition}
- Description: ${currentWeather.description}

Consider Indian monsoon patterns, seasonal trends, and agricultural needs.
Provide actionable farming advice for each day based on rain probability.

Respond strictly in JSON format:
{
  "city": "${city}",
  "summary": "2-3 sentence overview of the week's weather",
  "forecast": [
    { "day": "Today", "rainChance": 75, "condition": "Heavy rain expected", "advice": "Postpone irrigation, ensure drainage" },
    { "day": "Tomorrow", "rainChance": 60, "condition": "Light showers", "advice": "Monitor soil moisture" },
    { "day": "Day 3", "rainChance": 45, "condition": "Partly cloudy", "advice": "Good day for field work" },
    { "day": "Day 4", "rainChance": 55, "condition": "Scattered showers", "advice": "Prepare for rain" },
    { "day": "Day 5", "rainChance": 40, "condition": "Cloudy", "advice": "Normal farming activities" },
    { "day": "Day 6", "rainChance": 35, "condition": "Clearing up", "advice": "Resume full operations" },
    { "day": "Day 7", "rainChance": 30, "condition": "Clear skies", "advice": "Ideal for harvesting" }
  ],
  "farmingAdvice": "i want youto give suggetiion that how much should i wanter my crop for this upcoing week lie soicfi the how much they shold water ther crop based in it i wnat the gemeini to tell how they shiold water there  crop badec in thr rain pridection 
  "
}`;

  try {
    const data = await callGeminiAPI(prompt);
    console.log("🌧️ Gemini rain prediction response:", JSON.stringify(data, null, 2));

    let geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    geminiText = geminiText.trim().replace(/^```json\n?/g, "").replace(/\n?```$/g, "").trim();

    let json;
    try {
      json = JSON.parse(geminiText);
      if (!json.city || !json.summary || !json.forecast || json.forecast.length < 7) {
        throw new Error("Missing or incomplete fields");
      }
    } catch (err) {
      console.warn("⚠️ Gemini parse failed for rain prediction. Using fallback.");
      json = { ...fallbackRainForecast, city };
    }

    res.json(json);
  } catch (err) {
    console.error("❌ Gemini rain prediction error:", err.message);
    res.json({ ...fallbackRainForecast, city });
  }
});

// --- AI Chatbot ---
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are an expert agricultural assistant helping farmers in India. 
Answer farming questions clearly and concisely in simple language.
If the farmer asks about crop diseases, provide:
1. Disease name
2. Symptoms
3. Treatment/prevention methods
4. When to consult an expert

User question: ${message}`;

    const data = await callGeminiAPI(prompt);
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help with farming queries!";

    res.json({ reply });
  } catch (error) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message 
    });
  }
});

module.exports = router;
