import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getCart);
router.post('/add', protect, addItem);
router.put('/update', protect, updateItem);
router.delete('/remove/:id', protect, removeItem);
router.delete('/clear', protect, clearCart);

export default router;
