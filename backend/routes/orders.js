import { Router } from 'express';
import { createOrder, verifyPayment, getUserOrders, getOne, cancelOrder, updateStatus, getAllOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createOrder);
router.post('/payment/verify', protect, verifyPayment);
router.get('/', protect, getUserOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOne);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, adminOnly, updateStatus);

export default router;
