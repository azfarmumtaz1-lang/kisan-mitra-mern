import express from 'express';
import { askDoctorAI, getRecentQueries, submitFeedback } from '../controllers/aiAdvisorController.js';

const router = express.Router();

router.post('/ask', askDoctorAI);
router.get('/history', getRecentQueries);
router.post('/feedback', submitFeedback);

export default router;
