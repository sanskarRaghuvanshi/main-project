import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo.jpeg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Catalog', path: '/catalog' },
    { label: 'Skin Quiz', path: '/quiz' },
    { label: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-surface-2/90 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="container-custom px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to={user ? '/home' : '/'} className="flex items-center gap-2">
              <img src={logo} alt="Opal" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-display text-xl md:text-2xl font-bold text-primary">Opal</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {links.map(l => (
                <Link key={l.path} to={l.path} className="text-sm font-medium text-text hover:text-primary transition">{l.label}</Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/wishlist" className="relative btn-icon !w-9 !h-9" aria-label="Wishlist">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </Link>
                  <Link to="/cart" className="relative btn-icon !w-9 !h-9" aria-label="Cart">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                    {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{itemCount}</span>}
                  </Link>
                  <Link to="/profile" className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-primary font-bold text-xs">{user.name?.[0]}</span>}
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="text-xs text-text-muted hover:text-primary transition">Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn-primary !py-2 !px-5 text-xs">Sign In</Link>
              )}
              <button className="md:hidden btn-icon !w-9 !h-9" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-surface-2 border-t border-border px-4 py-4 space-y-2">
            {links.map(l => (
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-text hover:text-primary hover:bg-primary-light/10 rounded-xl transition">{l.label}</Link>
            ))}
          </div>
        )}
      </nav>

      <div className="md:hidden h-16" />
      <div className="hidden md:block h-20" />
    </>
  );
};

export default Navbar;
