import { Router } from 'express';
import { getAll, getBySlug, create, update, remove, getTags, adminGetAll } from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAll);
router.get('/tags', getTags);
router.get('/admin', protect, adminOnly, adminGetAll);
router.get('/:slug', getBySlug);
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

export default router;
