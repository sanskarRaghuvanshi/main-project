import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpeg';

const Login = () => {
  const [mode, setMode] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fillAdmin = () => {
    setMode('admin');
    setEmail('admin@opal.com');
    setPassword('admin123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(mode === 'admin' ? '/admin' : '/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2"><img src={logo} alt="" className="h-8 w-8 rounded-full" /><span className="font-display text-2xl text-primary font-bold">Opal</span></Link>
          <p className="text-text-muted mt-2">Welcome back, beauty</p>
        </div>
        <div className="flex bg-surface rounded-2xl p-1 mb-6 shadow-sm">
          <button onClick={() => { setMode('customer'); setEmail(''); setPassword(''); }} className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition ${mode === 'customer' ? 'bg-white shadow-card text-primary' : 'text-text-muted hover:text-text'}`}>Customer</button>
          <button onClick={fillAdmin} className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition ${mode === 'admin' ? 'bg-white shadow-card text-primary' : 'text-text-muted hover:text-text'}`}>Admin</button>
        </div>
        <form onSubmit={handleSubmit} className="bg-surface-2 rounded-3xl shadow-card p-8 space-y-5">
          <div><label className="block text-sm font-medium text-text mb-1.5">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required /></div>
          <div><label className="block text-sm font-medium text-text mb-1.5">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" required /></div>
          {mode === 'admin' && <p className="text-xs text-text-muted text-center">Predefined admin: admin@opal.com / admin123</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">{loading ? '...' : mode === 'admin' ? 'Admin Sign In' : 'Sign In'}</button>
          <p className="text-center text-sm text-text-muted">Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
