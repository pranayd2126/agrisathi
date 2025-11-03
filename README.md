# AgriSathi 🌾

An AI-powered agricultural platform connecting farmers with buyers and providing intelligent farming advisories.

## 🚀 Features

### For Farmers
- **Disease Detection** - Upload crop images for instant AI-powered diagnosis and treatment recommendations
- **Crop Price Forecasting** - View predicted mandi prices using historical data analysis
- **Weather Intelligence** - Real-time weather updates to plan irrigation and farming activities
- **Crop Planning** - Get intelligent crop recommendations based on your location and season
- **Government Schemes** - Browse and access relevant agricultural schemes and subsidies
- **AI Chatbot** - 24/7 farming assistant powered by advanced language models

### Marketplace
- **Buy & Sell** - Direct platform for farmers to connect with buyers
- **Fair Pricing** - Transparent pricing based on market trends
- **Secure Transactions** - Integrated payment gateway (Razorpay)

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Chart.js & Recharts** - Data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Firebase Admin** - Additional auth services
- **Google Generative AI** - AI/ML integration
- **Cloudinary** - Image storage and processing
- **Razorpay** - Payment processing
- **Socket.io** - Real-time features

### AI/ML Components
- **Python** - ML model serving
- **ChromaDB** - Vector database for knowledge base
- **Google Generative AI** - Language models for chatbot
- **RAG Architecture** - Retrieval-Augmented Generation for accurate responses

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Python 3.8+ (for AI chatbot)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file with required variables:
# PORT=4000
# MONGODB_URL=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# RAZORPAY_KEY_ID=your_razorpay_key
# RAZORPAY_KEY_SECRET=your_razorpay_secret
# CLOUDINARY_URL=your_cloudinary_url
# Add other required API keys

npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### AI Chatbot Setup

```bash
cd final_modal_demo1/0.FARMER_bot
pip install -r requirements.txt

# Create .env file with:
# GOOGLE_API_KEY=your_google_ai_api_key

# Ingest knowledge base
python ingest.py

# Start the chatbot server
python main.py
```

## 🏃‍♂️ Running the Application

1. **Start MongoDB** - Ensure MongoDB is running locally or have a cloud connection string

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:4000`

3. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```
   App opens on `http://localhost:3000`

4. **Start AI Chatbot** (Optional)
   ```bash
   cd final_modal_demo1/0.FARMER_bot
   python main.py
   ```

## 📁 Project Structure

```
agrisathi/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configurations
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   └── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main app component
│   │   └── api.js           # API configuration
│   └── package.json
│
└── final_modal_demo1/
    └── 0.FARMER_bot/        # AI chatbot module
        ├── agent.py         # AI agent logic
        ├── main.py          # Chatbot server
        ├── ingest.py        # Knowledge base ingestion
        └── chroma_db/       # Vector database
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

### ML Services
- `POST /api/ml/detect-disease` - Detect crop diseases
- `POST /api/ml/predict-price` - Forecast crop prices
- `GET /api/ml/recommendations` - Get crop recommendations

### Marketplace
- `GET /api/marketplace/listings` - Get all listings
- `POST /api/marketplace/create` - Create new listing
- `PUT /api/marketplace/update/:id` - Update listing
- `DELETE /api/marketplace/delete/:id` - Delete listing

### Utilities
- `GET /api/utils/weather` - Get weather data
- `GET /api/utils/schemes` - Get government schemes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👥 Authors

- Pranay Deshmukh - [@pranayd2126](https://github.com/pranayd2126)

## 🙏 Acknowledgments

- Google Generative AI for language models
- OpenWeather API for weather data
- Government of India agriculture data sources
- Open source community

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for Indian farmers
