import express from 'express';
import { getPests, getPestById, diagnoseBySymptoms, calculateSprayerDosage } from '../controllers/pestController.js';

const router = express.Router();

router.get('/', getPests);
router.get('/:id', getPestById);
router.post('/diagnose', diagnoseBySymptoms);
router.post('/calculate-sprayer', calculateSprayerDosage);

export default router;
