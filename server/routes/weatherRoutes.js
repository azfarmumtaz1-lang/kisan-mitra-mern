import express from 'express';
import { getAgriWeather } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/advisory', getAgriWeather);

export default router;
