import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice, formatDate } from '../utils/helpers';

const OrderConfirmed = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${orderId}`).then(r => setOrder(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="skeleton w-12 h-12 rounded-full" /></div>;

  return (
    <div className="container-custom px-4 py-20">
      <div className="max-w-lg mx-auto bg-surface-2 rounded-3xl shadow-card p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-h1 mt-6">Order Placed! 🎉</h1>
        <p className="text-text-muted mt-2">Your beauty haul is on its way</p>
        {order && <div className="mt-8 bg-primary/5 rounded-xl p-4 text-left text-sm space-y-2"><p>Order: <span className="font-mono font-medium">{order.orderNumber || order._id}</span></p><p>Total: <span className="font-bold text-primary">{formatPrice(order.total)}</span></p><p>Status: <span className="font-medium text-success capitalize">{order.orderStatus.replace(/_/g, ' ')}</span></p>{order.estimatedDelivery && <p>Estimated delivery: <span className="font-medium">{formatDate(order.estimatedDelivery)}</span></p>}</div>}
        <p className="text-sm text-text-muted mt-6">Confirmation sent to your email</p>
        <div className="flex flex-wrap gap-4 justify-center mt-8"><Link to="/home" className="btn-primary">Continue Shopping</Link><Link to="/profile/orders" className="btn-secondary">View Orders</Link></div>
      </div>
    </div>
  );
};

export default OrderConfirmed;
