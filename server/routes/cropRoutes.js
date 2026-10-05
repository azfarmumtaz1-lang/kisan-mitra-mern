import express from 'express';
import { getCrops, getCropById, recommendSowing } from '../controllers/cropController.js';

const router = express.Router();

router.get('/', getCrops);
router.get('/:id', getCropById);
router.post('/recommend', recommendSowing);

export default router;
