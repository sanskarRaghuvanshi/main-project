import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpeg';

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      setUserId(res.userId);
      setStep(2);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(userId, otp);
      toast.success('Welcome to Opal!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2"><img src={logo} alt="" className="h-8 w-8 rounded-full" /><span className="font-display text-2xl text-primary font-bold">Opal</span></Link>
          <p className="text-text-muted mt-2">Begin your beauty journey</p>
        </div>
        {step === 1 ? (
          <form onSubmit={handleRegister} className="bg-surface-2 rounded-3xl shadow-card p-8 space-y-5">
            <div><label className="block text-sm font-medium text-text mb-1.5">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="Your name" required /></div>
            <div><label className="block text-sm font-medium text-text mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="you@example.com" required /></div>
            <div><label className="block text-sm font-medium text-text mb-1.5">Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input" placeholder="Min 6 characters" minLength={6} required /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">{loading ? '...' : 'Register'}</button>
            <p className="text-center text-sm text-text-muted">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link></p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="bg-surface-2 rounded-3xl shadow-card p-8 space-y-5">
            <p className="text-sm text-text-muted text-center">Enter the OTP sent to <span className="font-medium text-text">{form.email}</span></p>
            <div><label className="block text-sm font-medium text-text mb-1.5">OTP Code</label><input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="input text-center text-2xl tracking-widest" placeholder="000000" maxLength={6} required /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">{loading ? '...' : 'Verify & Continue'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
