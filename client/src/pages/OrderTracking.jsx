import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice, formatDate } from '../utils/helpers';
import { statusColors } from '../constants/index';
import OrderTimeline from '../components/ui/OrderTimeline';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${orderId}`).then(r => setOrder(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="container-custom px-4 py-20"><div className="max-w-2xl mx-auto space-y-4"><div className="skeleton h-8 w-64" /><div className="skeleton h-64 rounded-2xl" /><div className="skeleton h-40 rounded-2xl" /></div></div>;
  if (!order) return <div className="container-custom px-4 py-20 text-center text-text-muted">Order not found</div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/profile/orders" className="text-sm text-text-muted hover:text-primary transition inline-flex items-center gap-1 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Orders
        </Link>

        <div className="bg-surface-2 rounded-2xl p-6 shadow-card mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-h1">Track Order</h1>
              <p className="text-sm text-text-muted font-mono mt-1">{order.orderNumber || `#${order._id.slice(-8)}`}</p>
              <p className="text-xs text-text-muted mt-0.5">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`badge capitalize ${statusColors[order.orderStatus] || 'badge-primary'}`}>{order.orderStatus.replace(/_/g, ' ')}</span>
          </div>
          {order.estimatedDelivery && (
            <div className="mt-4 bg-primary/5 rounded-xl px-4 py-3 text-sm">
              <span className="text-text-muted">Estimated delivery: </span>
              <span className="font-medium text-primary">{formatDate(order.estimatedDelivery)}</span>
            </div>
          )}
        </div>

        <div className="bg-surface-2 rounded-2xl p-6 shadow-card mb-6">
          <h2 className="font-semibold mb-4">Order Timeline</h2>
          <OrderTimeline statusHistory={order.statusHistory} orderStatus={order.orderStatus} />
        </div>

        <div className="bg-surface-2 rounded-2xl p-6 shadow-card mb-6">
          <h2 className="font-semibold mb-4">Items ({order.items?.length || 0})</h2>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-14 h-14 bg-primary-light/10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  {item.variant && <p className="text-xs text-text-muted">{item.variant}</p>}
                  <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-text-muted">Delivery</span><span>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'FREE'}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        {order.address && (
          <div className="bg-surface-2 rounded-2xl p-6 shadow-card mb-6">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            <div className="text-sm space-y-0.5 text-text-muted">
              <p className="font-medium text-text">{order.address.name}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}</p>
              <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
            </div>
          </div>
        )}

        <div className="bg-surface-2 rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Payment</h2>
          <div className="text-sm space-y-1 text-text-muted">
            <p>Method: <span className="font-medium text-text uppercase">{order.paymentMethod}</span></p>
            <p>Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-success' : order.paymentStatus === 'pending' ? 'text-warning' : 'text-error'}`}>{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
