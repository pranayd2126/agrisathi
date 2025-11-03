const express = require('express');
const axios = require('axios');
const router = express.Router();


router.get('/weather', async (req,res)=>{
  const { lat, lon, q } = req.query;
  try {
    const params = q ? { q, appid: process.env.OPENWEATHER_API_KEY, units:'metric' } :
      { lat, lon, appid: process.env.OPENWEATHER_API_KEY, units:'metric' };
    const resp = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params });
    return res.json(resp.data);
  } catch(err){
    console.error(err.message);
    return res.status(500).json({error:'Weather API failure', detail: err.message});
  }
});

// fetch schemes (simplified)
router.get('/schemes', async (req,res)=>{
  // Example: call data.gov.in or MyGov RSS feed. For brevity, we return mock + show how to call external API.
  try{
       const schemes = [
      {
        id: 1,
        title: 'PM Kisan Samman Nidhi',
        description: 'Income support scheme providing ₹6000/year to small & marginal farmers.',
        states: ['All States'],
        link: 'https://pmkisan.gov.in/'
      },
      {
        id: 2,
        title: 'Soil Health Card Scheme',
        description: 'Provides soil testing and nutrient recommendations to farmers.',
        states: ['All States'],
        link: 'https://soilhealth.dac.gov.in/'
      },
      {
        id: 3,
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Crop insurance scheme covering losses due to natural calamities.',
        states: ['All States'],
        link: 'https://pmfby.gov.in/'
      },
      {
        id: 4,
        title: 'Rashtriya Krishi Vikas Yojana (RKVY)',
        description: 'Promotes holistic development of agriculture & allied sectors.',
        states: ['All States'],
        link: 'https://rkvy.nic.in/'
      },
      {
        id: 5,
        title: 'National Mission for Sustainable Agriculture (NMSA)',
        description: 'Encourages sustainable farming practices and water conservation.',
        states: ['All States'],
        link: 'https://nmsa.dac.gov.in/'
      },
      {
        id: 6,
        title: 'Micro Irrigation Scheme',
        description: 'Supports drip & sprinkler irrigation systems to save water.',
        states: ['All States'],
        link: 'https://agricoop.nic.in/micro-irrigation'
      },
      {
        id: 7,
        title: 'Kisan Credit Card (KCC)',
        description: 'Provides farmers with timely credit for agricultural needs.',
        states: ['All States'],
        link: 'https://www.kisancreditcard.com/'
      }
    ];

    return res.json({ schemes });
  } catch(e){ return res.status(500).json({error:e.message}); }
});

module.exports = router;
