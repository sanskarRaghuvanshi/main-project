import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatPrice } from '../../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/admin/stats').then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const cards = [
    { label: 'Revenue', value: stats ? formatPrice(stats.totalRevenue) : '...', color: 'bg-success/10 text-success', link: '/admin/orders' },
    { label: 'Orders', value: stats?.totalOrders, color: 'bg-purple-100 text-purple-600', link: '/admin/orders' },
    { label: 'Products', value: stats?.totalProducts, color: 'bg-blue-100 text-blue-600', link: '/admin/products' },
    { label: 'Users', value: stats?.totalUsers, color: 'bg-accent/20 text-accent', link: '/admin/users' },
  ];

  return (
    <div>
      <h1 className="text-h1 mb-8">Dashboard</h1>
      {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      : <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{cards.map(c => <Link key={c.label} to={c.link} className={`${c.color} rounded-2xl p-6 hover:shadow-hover transition`}><p className="text-sm opacity-75">{c.label}</p><p className="text-3xl font-bold mt-2">{c.value}</p></Link>)}</div>}
      <div className="grid md:grid-cols-2 gap-6 mt-8"><div className="bg-surface-2 rounded-2xl p-6 shadow-card"><h2 className="font-semibold mb-4">Quick Actions</h2><div className="space-y-3"><Link to="/admin/products" className="block w-full px-4 py-3 bg-primary/5 rounded-xl text-primary font-medium text-sm hover:bg-primary/10 transition">Manage Products</Link><Link to="/admin/orders" className="block w-full px-4 py-3 bg-purple-50 rounded-xl text-purple-600 font-medium text-sm hover:bg-purple-100 transition">Manage Orders</Link><Link to="/admin/invoices" className="block w-full px-4 py-3 bg-green-50 rounded-xl text-green-600 font-medium text-sm hover:bg-green-100 transition">View Invoices</Link><Link to="/admin/reports" className="block w-full px-4 py-3 bg-amber-50 rounded-xl text-amber-600 font-medium text-sm hover:bg-amber-100 transition">Profit Reports</Link><Link to="/admin/users" className="block w-full px-4 py-3 bg-blue-50 rounded-xl text-blue-600 font-medium text-sm hover:bg-blue-100 transition">Manage Users</Link><Link to="/admin/coupons" className="block w-full px-4 py-3 bg-accent/20 rounded-xl text-amber-600 font-medium text-sm hover:bg-accent/30 transition">Manage Coupons</Link></div></div><div className="bg-surface-2 rounded-2xl p-6 shadow-card"><h2 className="font-semibold mb-4">Blog Management</h2><Link to="/admin/products" className="block w-full text-center px-4 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition">Create Blog Post</Link></div></div>
    </div>
  );
};

export default Dashboard;
