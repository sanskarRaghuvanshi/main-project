import { Router } from 'express';
import { recommend } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/recommend', protect, recommend);

export default router;
