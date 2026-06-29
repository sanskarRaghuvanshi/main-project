import { Router } from 'express';
import { validate, getAvailable, getAll, create, update, remove } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/validate', validate);
router.get('/available', getAvailable);
router.get('/', protect, adminOnly, getAll);
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

export default router;
