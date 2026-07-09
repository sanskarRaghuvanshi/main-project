import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SocialAuth = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sp.get('token');
    const userStr = sp.get('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/home';
      } catch {
        navigate('/login?error=social');
      }
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="skeleton w-12 h-12 rounded-full mx-auto" />
        <p className="mt-4 text-text-muted text-sm">Signing you in...</p>
      </div>
    </div>
  );
};

export default SocialAuth;
