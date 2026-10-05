import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import cropRoutes from './routes/cropRoutes.js';
import pestRoutes from './routes/pestRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (with automatic fallback to embedded dataset if mongod is starting)
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder for disease scan / crop photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/crops', cropRoutes);
app.use('/api/pests', pestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/weather', weatherRoutes);

// Root & Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'KisanMitra Agricultural Sowing & Pest AI Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static frontend assets if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.send('🌾 KisanMitra MERN Server is running. Access API endpoints under /api/* or run client on port 3000.');
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 KisanMitra API Server running on port ${PORT} (http://localhost:${PORT})`);
});
