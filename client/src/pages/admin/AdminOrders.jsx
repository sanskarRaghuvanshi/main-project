import { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/helpers';
import { statusColors } from '../../constants/index';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { API.get('/orders/all', { params: { status: filter || undefined } }).then(r => setOrders(r.data.data?.orders || [])).catch(() => {}).finally(() => setLoading(false)); }, [filter]);

  const update = async (id, status) => { try { await API.put(`/orders/${id}/status`, { orderStatus: status }); setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o)); toast.success(`Order ${status}`); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-h1">Orders</h1><select value={filter} onChange={e => setFilter(e.target.value)} className="input !py-2 !w-40 text-sm"><option value="">All Status</option>{['pending','confirmed','dispatched','out_for_delivery','delivered','cancelled'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select></div>
      {loading ? <div className="animate-pulse space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div> : <div className="space-y-4">{orders.map(o => <div key={o._id} className="bg-surface-2 rounded-2xl p-5 shadow-card"><div className="flex items-center justify-between mb-3"><div><p className="text-xs text-text-muted font-mono">{o.orderNumber || `#${o._id.slice(-8)}`}</p><p className="text-xs text-text-muted">{new Date(o.createdAt).toLocaleDateString()} — {o.userId?.name || 'N/A'}</p></div><span className={`badge capitalize ${statusColors[o.orderStatus] || ''}`}>{o.orderStatus.replace(/_/g, ' ')}</span></div><div className="text-sm mb-3 text-text-muted">{o.items?.slice(0,3).map((item, i) => <span key={i}>{item.name}{i < Math.min(o.items.length,3) - 1 ? ', ' : ''}</span>)}{o.items?.length > 3 && <span> +{o.items.length - 3} more</span>}</div><div className="flex items-center justify-between"><p className="font-bold">{formatPrice(o.total)}</p><div className="flex gap-2">{o.orderStatus === 'pending' && <button onClick={() => update(o._id, 'confirmed')} className="btn-primary text-xs !py-1.5 !px-3">Confirm</button>}{o.orderStatus === 'confirmed' && <button onClick={() => update(o._id, 'dispatched')} className="btn-gold text-xs !py-1.5 !px-3" style={{background:'#FFB347',color:'#1A1A2E',borderRadius:'999px',padding:'6px 12px',fontSize:'12px',fontWeight:'500',border:'none',cursor:'pointer'}}>Dispatch</button>}{o.orderStatus === 'dispatched' && <button onClick={() => update(o._id, 'out_for_delivery')} className="btn-secondary text-xs !py-1.5 !px-3">Out for Delivery</button>}{o.orderStatus === 'out_for_delivery' && <button onClick={() => update(o._id, 'delivered')} className="btn-primary text-xs !py-1.5 !px-3">Deliver</button>}</div></div></div>)}</div>}
    </div>
  );
};

export default AdminOrders;
