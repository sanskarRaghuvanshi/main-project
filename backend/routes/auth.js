import { Router } from 'express';
import { register, verifyOTP, login, getMe, updateProfile, addAddress, deleteAddress } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/utils.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/verify-otp', verifyOTP);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);

export default router;
