import { Router } from 'express';
import { uploadSingle, uploadMultiple } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/image', protect, adminOnly, uploadSingle, (req, res) => {
  res.json({ success: true, data: { url: req.file.path } });
});

router.post('/images', protect, adminOnly, uploadMultiple, (req, res) => {
  const urls = req.files.map(f => f.path);
  res.json({ success: true, data: { urls } });
});

export default router;
