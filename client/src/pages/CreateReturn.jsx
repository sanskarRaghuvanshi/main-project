import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const reasons = [
  { value: 'damaged', label: 'Damaged or broken' },
  { value: 'wrong_item', label: 'Wrong item received' },
  { value: 'defective', label: 'Defective or not working' },
  { value: 'not_as_described', label: 'Not as described' },
  { value: 'other', label: 'Other reason' },
];

const CreateReturn = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders').then(r => {
      setOrders((r.data.data || []).filter(o => o.orderStatus === 'delivered'));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleItem = (item) => {
    setSelectedItems(prev => prev.find(i => i.productId === item.productId && i.variant === item.variant) ? prev.filter(i => !(i.productId === item.productId && i.variant === item.variant)) : [...prev, item]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !selectedItems.length || !reason) return;
    setSubmitting(true);
    try {
      await API.post('/returns', {
        orderId: selectedOrder._id,
        items: selectedItems,
        reason,
        reasonDetail,
      });
      toast.success('Return request submitted!');
      navigate('/profile/returns');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="container-custom px-4 py-20 text-center"><div className="skeleton w-12 h-12 rounded-full mx-auto" /></div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <h1 className="section-title mb-8">Request Return</h1>

      {!selectedOrder ? (
        <div>
          <p className="text-sm text-text-muted mb-4">Select a delivered order to return items from:</p>
          {orders.length === 0 ? (
            <div className="bg-surface-2 rounded-2xl p-8 text-center text-text-muted">
              <p>No delivered orders available for return.</p>
              <p className="text-sm mt-2">Only delivered orders can be returned within 7 days.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <button key={o._id} onClick={() => setSelectedOrder(o)} className="w-full bg-surface-2 rounded-2xl p-5 shadow-card text-left hover:shadow-hover transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono text-sm font-medium">{o.orderNumber}</p>
                      <p className="text-xs text-text-muted mt-0.5">{new Date(o.createdAt).toLocaleDateString()} — {o.items?.length} item(s)</p>
                    </div>
                    <p className="font-bold">{formatPrice(o.total)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-xl">
          <button type="button" onClick={() => setSelectedOrder(null)} className="text-sm text-text-muted hover:text-primary transition mb-4 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Change order
          </button>

          <div className="bg-surface-2 rounded-2xl p-6 shadow-card mb-6">
            <h2 className="font-semibold mb-4">Select items to return</h2>
            <div className="space-y-3">
              {selectedOrder.items?.map((item, i) => {
                const key = item.productId + item.variant;
                const checked = selectedItems.find(si => si.productId === item.productId && si.variant === item.variant);
                return (
                  <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${checked ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <input type="checkbox" checked={!!checked} onChange={() => toggleItem({ productId: item.productId?._id || item.productId, name: item.name, image: item.image || '', variant: item.variant || '', price: item.price, quantity: item.quantity })} className="text-primary focus:ring-primary" />
                    <div className="w-12 h-12 bg-primary-light/10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-sm">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.variant} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-2 rounded-2xl p-6 shadow-card mb-6">
            <h2 className="font-semibold mb-4">Reason for return</h2>
            <div className="space-y-4">
              <select value={reason} onChange={e => setReason(e.target.value)} className="input" required>
                <option value="">Select a reason</option>
                {reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <textarea value={reasonDetail} onChange={e => setReasonDetail(e.target.value)} className="input" rows={3} placeholder="Tell us more (optional)" />
            </div>
          </div>

          <button type="submit" disabled={submitting || !selectedItems.length || !reason} className="btn-primary">
            {submitting ? '...' : `Submit Return Request`}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateReturn;
