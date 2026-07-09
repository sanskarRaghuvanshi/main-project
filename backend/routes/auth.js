import { Router } from 'express';
import passport from '../config/passport.js';
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

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }), (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/auth/social?token=${req.user.token}&user=${encodeURIComponent(JSON.stringify(req.user.user))}`);
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook` }), (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/auth/social?token=${req.user.token}&user=${encodeURIComponent(JSON.stringify(req.user.user))}`);
});

export default router;
