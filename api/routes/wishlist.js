import { Router } from 'express';
import { getWishlist, addItem, removeItem } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getWishlist);
router.post('/add', protect, addItem);
router.delete('/remove/:productId', protect, removeItem);

export default router;
