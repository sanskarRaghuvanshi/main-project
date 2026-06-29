import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { statusColors } from '../constants/index';
import { EmptyState } from '../components/ui/index';
import API from '../api/axios';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/orders').then(r => setOrders(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const cancel = async (id) => { if (!confirm('Cancel this order?')) return; try { await API.put(`/orders/${id}/cancel`); setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: 'cancelled' } : o)); toast.success('Cancelled'); } catch { toast.error('Failed'); } };

  if (loading) return <div className="py-20 text-center"><div className="skeleton w-12 h-12 rounded-full mx-auto" /></div>;
  if (!orders.length) return <div className="container-custom px-4 py-20"><EmptyState icon="📦" title="No orders yet" subtitle="Your orders will appear here" cta="Start Shopping" onCta={() => window.location = '/catalog'} /></div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <h1 className="section-title mb-8">My Orders</h1>
      <div className="space-y-4">{orders.map(order => <div key={order._id} className="bg-surface-2 rounded-2xl p-6 shadow-card"><div className="flex items-center justify-between mb-4"><div><p className="text-xs text-text-muted font-mono">{order.orderNumber || `#${order._id.slice(-8)}`}</p><p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</p></div><span className={`badge capitalize ${statusColors[order.orderStatus] || 'badge-primary'}`}>{order.orderStatus.replace(/_/g, ' ')}</span></div>
        <div className="space-y-2">{order.items?.map((item, i) => <div key={i} className="flex gap-3 items-center"><div className="w-12 h-12 bg-primary-light/10 rounded-lg overflow-hidden flex-shrink-0"><img src={item.image || ''} alt="" className="w-full h-full object-cover" /></div><div className="flex-1 text-sm"><p className="font-medium truncate">{item.name}</p><p className="text-xs text-text-muted">Qty: {item.quantity}</p></div><p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p></div>)}</div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border"><p className="font-bold">{formatPrice(order.total)}</p><div className="flex gap-3"><Link to={`/order-confirmed/${order._id}`} className="text-sm text-primary hover:underline">Details</Link>{['pending','confirmed'].includes(order.orderStatus) && <button onClick={() => cancel(order._id)} className="text-sm text-error hover:underline">Cancel</button>}</div></div></div>)}</div>
    </div>
  );
};

export default MyOrders;
