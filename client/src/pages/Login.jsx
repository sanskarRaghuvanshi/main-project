import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [sp] = useSearchParams();

  useEffect(() => {
    const err = sp.get('error');
    if (err === 'google') toast.error('Google login failed');
    if (err === 'facebook') toast.error('Facebook login failed');
  }, [sp]);

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
          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="bg-surface-2 px-3 text-xs text-text-muted">or continue with</span></div></div>
          <div className="grid grid-cols-2 gap-3">
            <a href={`${import.meta.env.VITE_API_URL}/auth/google`} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-text hover:bg-surface transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </a>
            <a href={`${import.meta.env.VITE_API_URL}/auth/facebook`} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-text hover:bg-surface transition">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
          </div>
          <p className="text-center text-sm text-text-muted">Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
