import { Router } from 'express';
import { createReturn, getMyReturns, getReturnById, getAllReturns, approveReturn, rejectReturn } from '../controllers/returnController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createReturn);
router.get('/my', protect, getMyReturns);
router.get('/all', protect, adminOnly, getAllReturns);
router.get('/:id', protect, getReturnById);
router.put('/:id/approve', protect, adminOnly, approveReturn);
router.put('/:id/reject', protect, adminOnly, rejectReturn);

export default router;
