import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '../../utils/helpers';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const returnStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  refunded: 'bg-green-100 text-green-700',
};

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => { load(); }, [filter]);

  const load = () => {
    API.get('/returns/all', { params: { status: filter || undefined } })
      .then(r => setReturns(r.data.data?.returns || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const approve = async (id) => {
    try {
      await API.put(`/returns/${id}/approve`, { note });
      toast.success('Return approved');
      setSelected(null);
      setNote('');
      load();
    } catch { toast.error('Failed'); }
  };

  const reject = async (id) => {
    if (!note) { toast.error('Please provide a reason'); return; }
    try {
      await API.put(`/returns/${id}/reject`, { note });
      toast.success('Return rejected');
      setSelected(null);
      setNote('');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1">Returns</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input !py-2 !w-40 text-sm">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {returns.map(r => (
            <div key={r._id} onClick={() => { setSelected(r); setNote(''); }} className="bg-surface-2 rounded-2xl p-5 shadow-card hover:shadow-hover transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-mono">{r.orderId?.orderNumber || 'N/A'}</p>
                  <p className="text-xs text-text-muted mt-0.5">{r.userId?.name} — {formatDate(r.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(r.refundAmount)}</p>
                  <span className={`badge text-xs capitalize ${returnStatusColors[r.status] || ''}`}>{r.status}</span>
                </div>
              </div>
              <div className="text-xs text-text-muted mt-2">Reason: <span className="font-medium capitalize">{r.reason.replace(/_/g, ' ')}</span> · {r.items?.length || 0} item(s)</div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-surface-2 rounded-3xl shadow-modal p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold text-lg mb-4">Return Details</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-text-muted">Order</span><span className="font-mono font-medium">{selected.orderId?.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Customer</span><span>{selected.userId?.name} ({selected.userId?.email})</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Reason</span><span className="capitalize">{selected.reason.replace(/_/g, ' ')}</span></div>
              {selected.reasonDetail && <div><span className="text-text-muted block">Details</span><p className="mt-1">{selected.reasonDetail}</p></div>}
              <div className="flex justify-between"><span className="text-text-muted">Refund Amount</span><span className="font-bold">{formatPrice(selected.refundAmount)}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Status</span><span className={`badge capitalize ${returnStatusColors[selected.status] || ''}`}>{selected.status}</span></div>
            </div>

            <div className="space-y-2 mb-6">
              {selected.items?.map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-surface p-3 rounded-xl">
                  <div className="w-10 h-10 bg-primary-light/10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.variant} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {selected.status === 'pending' && (
              <div className="space-y-4">
                <textarea value={note} onChange={e => setNote(e.target.value)} className="input" rows={2} placeholder="Admin note (required for rejection)" />
                <div className="flex gap-3">
                  <button onClick={() => approve(selected._id)} className="btn-primary flex-1 !py-2.5 text-sm">Approve & Refund</button>
                  <button onClick={() => reject(selected._id)} className="btn-secondary flex-1 !py-2.5 text-sm">Reject</button>
                </div>
              </div>
            )}
            {selected.status !== 'pending' && selected.adminNote && (
              <div className="bg-surface rounded-xl p-3 text-sm">
                <span className="text-text-muted">Admin Note:</span>
                <p className="mt-0.5">{selected.adminNote}</p>
              </div>
            )}
            <button onClick={() => setSelected(null)} className="btn-ghost w-full mt-4 !py-2 text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
