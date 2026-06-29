import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { label: 'Dashboard', path: '/admin', end: true },
  { label: 'Products', path: '/admin/products' },
  { label: 'Orders', path: '/admin/orders' },
  { label: 'Invoices', path: '/admin/invoices' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Coupons', path: '/admin/coupons' },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <Link to="/login" onClick={logout} className="text-sm text-text-muted hover:text-primary transition flex items-center gap-1">&larr; Back to Login</Link>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-48 flex-shrink-0">
          <h2 className="font-display text-lg font-bold mb-4">Admin</h2>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {links.map(l => (
              <NavLink key={l.path} to={l.path} end={l.end}
                className={({ isActive }) => `whitespace-nowrap md:whitespace-normal px-4 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-primary text-white' : 'text-text-muted hover:bg-primary-light/20 hover:text-primary'}`}
              >{l.label}</NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0"><Outlet /></div>
      </div>
    </div>
  );
};

export default AdminLayout;
