import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice, formatDate } from '../utils/helpers';
import { EmptyState } from '../components/ui/index';

const returnStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  refunded: 'bg-green-100 text-green-700',
};

const MyReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/returns/my').then(r => setReturns(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="py-20 text-center"><div className="skeleton w-12 h-12 rounded-full mx-auto" /></div>;
  if (!returns.length) return <div className="container-custom px-4 py-20"><EmptyState icon="🔄" title="No returns yet" subtitle="Your return requests will appear here" cta="View Orders" onCta={() => window.location = '/profile/orders'} /></div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title mb-0">My Returns</h1>
        <Link to="/profile/returns/new" className="btn-primary !py-2 !px-4 text-sm">Request Return</Link>
      </div>
      <div className="space-y-4">
        {returns.map(r => (
          <div key={r._id} className="bg-surface-2 rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-text-muted font-mono">{r.orderId?.orderNumber || 'N/A'}</p>
                <p className="text-xs text-text-muted">{formatDate(r.createdAt)}</p>
              </div>
              <span className={`badge capitalize ${returnStatusColors[r.status] || 'badge-primary'}`}>{r.status}</span>
            </div>
            <div className="text-sm text-text-muted space-y-1">
              <p>Reason: <span className="font-medium text-text capitalize">{r.reason.replace(/_/g, ' ')}</span></p>
              {r.reasonDetail && <p>Details: {r.reasonDetail}</p>}
              <p>Refund: <span className="font-medium text-text">{formatPrice(r.refundAmount)}</span></p>
              {r.adminNote && <p className="mt-2 text-xs italic">Note: {r.adminNote}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReturns;
