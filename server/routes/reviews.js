import { Router } from 'express';
import { create, getByProduct, getMy, update, remove } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, create);
router.get('/product/:id', getByProduct);
router.get('/my', protect, getMy);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

export default router;
