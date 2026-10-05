# 🌾 KisanMitra (किसान मित्र) - MERN Smart Sowing & AI Pest Advisory Platform

A full-stack **MERN (MongoDB, Express, React, Node.js)** agricultural platform designed to empower farmers with seasonal sowing intelligence and an intelligent AI plant doctor (**Dr. Kisan AI**) to eliminate confusion regarding crop pests, insect attacks, fungal diseases, and exact pesticide sprayer dilutions.

---

## 🚀 Live Services Running

- **Frontend App (React + Vite + Tailwind):** [http://localhost:3000](http://localhost:3000)
- **Full-Stack API Server (Node + Express):** [http://localhost:5000](http://localhost:5000)
- **Health Check Endpoint:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MongoDB Database:** `mongodb://127.0.0.1:27017/krishi_mitra`

---

## ✨ Key Features

### 1. 🌾 Seasonal Sowing Guide & Smart Crop Selection Wizard
- **Comprehensive Seasonal Calendar:**
  - **Rabi (रबी - Winter: Oct-Apr):** Wheat, Mustard, Bengal Gram (चना), Potato, Barley.
  - **Kharif (खरीफ - Monsoon: June-Nov):** Paddy (Rice), Bt Cotton, Soybean, Maize, Chilli.
  - **Zaid (जायद - Summer: Mar-June):** Watermelon, Cucumber, Summer Moong.
  - **Year-Round (बारहमासी):** Sugarcane, Tomato, Fruit crops.
- **Multi-Parameter Filtering:** Filter by Season, Soil Type (Black Cotton, Loamy, Alluvial, Sandy Loam, Clay, Red), and Water Availability (Low/Rainfed, Medium, High/Canal).
- **10-Second Smart Sowing Wizard:** Farmers enter their land size (in acres) and goal (Maximize Net Profit vs Low Risk & MSP); the engine calculates total costs, expected yield, and net profit per acre with tailored recommendations.
- **Detailed Agronomy Popups:** Complete step-by-step instructions on field preparation, seed treatment (बीजोपचार), spacing, depth, critical irrigation stages, and NPK fertilizer schedules.

### 2. 🩺 Dr. Kisan AI - Agricultural Entomologist & Pesticide Advisor
- **Bilingual Natural Language Understanding:** Accepts queries in English, Hindi, and Hinglish (e.g., *"tamatar me patte pe safed powder jaisa hai kaun sa spray karein"*, *"cotton me pink bollworm ka kya ilaj hai"*, *"fall armyworm in corn dosage"*).
- **15-Liter Knapsack Sprayer Tank Dilution:**
  - Solves the #1 confusion farmers face: *"How much medicine should I put in my 15L backpack sprayer?"*
  - Automatically calculates and highlights the exact dose per 15-liter sprayer tank (e.g., 6 ml Coragen or 30g Ridomil MZ).
- **Dual Prescription Model:**
  - 🌿 **Organic & Biological Control:** Safe, cost-effective bio-pesticides (Neem oil 10,000 ppm, Trichoderma, Beauveria bassiana, Pheromone traps).
  - 🧪 **Chemical Pesticides:** Approved active ingredients and commercial brand names (Coragen, Confidor, Proclaim, Ridomil Gold, Contaf Plus).
- **Pre-Harvest Interval (PHI):** Displays the exact waiting days before harvesting for consumer and food safety.
- **Audio Voice Synthesis (🔊 Listen Aloud):** One-click button allows farmers who prefer listening to hear the advice spoken aloud in Hindi or English.
- **Visual Symptom Diagnostic Matrix:** Farmers who don't know the pest's name can click visual symptoms (*"Holes in leaves"*, *"Curled leaves"*, *"Powdery spots"*, *"Drying central shoot"*) to run an instant diagnosis.
- **Leaf Photo Scanner Simulator:** Simulates mobile photo scanning of infected leaves and provides instant diagnosis and remedies.

### 3. 🐛 Pest & Disease Encyclopedia
- Searchable reference library of all major agricultural pests, insects, and fungal diseases.
- Visual toxicity badges (Green = Safe, Blue = Moderately Toxic, Yellow = Highly Toxic).
- Commercial trade names, affected crops, and clinical identification guides.

### 4. 🧮 Sprayer Tank Dilution & Area Calculator
- Customizable tank size (15L, 16L, 20L).
- Calculates exact chemical quantity, number of sprayer tanks, and total water volume needed for any farm size.
- Includes vital spraying rules (spraying hours, wind direction, PPE protective gear).

---

## 🏗️ Project Architecture

```
kisan-mitra-mern/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic & resilience
│   ├── models/
│   │   ├── Crop.js               # Sowing calendar, soils, yields, economics
│   │   ├── Pest.js               # Pests, symptoms, organic & chemical remedies
│   │   └── FarmerQuery.js        # Conversation & diagnosis query logs
│   ├── controllers/
│   │   ├── cropController.js     # Seasonal filtering & Sowing wizard
│   │   ├── pestController.js     # Symptom matrix diagnosis & sprayer calculations
│   │   ├── aiAdvisorController.js# Dr. Kisan AI engine & interaction logs
│   │   └── weatherController.js  # Weather, active season, and spray safety index
│   ├── routes/
│   │   ├── cropRoutes.js
│   │   ├── pestRoutes.js
│   │   ├── aiRoutes.js
│   │   └── weatherRoutes.js
│   ├── services/
│   │   └── aiKnowledgeEngine.js  # Agricultural diagnostic engine & Gemini API integration
│   ├── data/
│   │   ├── cropsData.js          # Seed dataset for seasonal crops & agronomy
│   │   └── pestsData.js          # Seed dataset for pests, symptoms & dosages
│   ├── scripts/
│   │   └── seed.js               # Database population script
│   ├── .env                      # Server configuration
│   └── server.js                 # Express server & static asset handler
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx            # Bilingual navbar, tabs, helpline
    │   │   ├── WeatherBanner.jsx     # Live seasonal dashboard & spray safety
    │   │   ├── SeasonSowingGuide.jsx # Sowing calendar & 10-sec crop wizard
    │   │   ├── PestDoctorAI.jsx      # Dr. Kisan AI, speech synthesis, symptom matrix
    │   │   ├── PesticideDirectory.jsx# Pest encyclopedia
    │   │   ├── DosageCalculator.jsx  # 15L Knapsack sprayer calculator
    │   │   └── CropDetailModal.jsx   # Deep agronomic sowing guide popup
    │   ├── services/
    │   │   └── api.js                # Centralized REST client
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or MongoDB Atlas connection string)

### 1. Start MongoDB
Ensure `mongod` is running on `localhost:27017`.

### 2. Run the Backend Server
```bash
cd server
npm install
npm run seed     # Seeds crops and pests into MongoDB
npm start        # Starts server on http://localhost:5000
```

### 3. Run the Frontend (Development)
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/crops?season=Rabi&soilType=Loamy` | Fetch crops filtered by season and soil |
| `POST` | `/api/crops/recommend` | Sowing recommendation wizard calculation |
| `GET` | `/api/pests?crop=Cotton` | Fetch pests and plant diseases |
| `POST` | `/api/pests/diagnose` | Diagnose insect or disease using visual symptom checklist |
| `POST` | `/api/pests/calculate-sprayer` | Calculate 15L tank dosage & water volume |
| `POST` | `/api/ai/ask` | Ask Dr. Kisan AI in natural language (Hindi/English) |
| `GET` | `/api/weather/advisory` | Live agricultural season & spray safety forecast |
