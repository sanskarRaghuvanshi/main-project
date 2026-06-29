import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, subtotal, coupon, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const [payment, setPayment] = useState('razorpay');
  const discount = coupon?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ productId: i.productId?._id || i.productId, name: i.productId?.name || i.name, image: i.productId?.images?.[0] || '', variant: i.variant || '', price: i.price || i.productId?.variants?.[0]?.price || 0, quantity: i.quantity }));
      const r = await API.post('/orders', { items: orderItems, address, paymentMethod: payment, subtotal, couponCode: coupon?.code, deliveryFee: 0, discount, total });
      if (r.data.data?.razorpayOrderId) {
        const opts = { key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T4YctQuzWnebkd', amount: r.data.data.amount, currency: 'INR', name: 'Opal Beauty', order_id: r.data.data.razorpayOrderId, handler: async (resp) => { try { await API.post('/orders/payment/verify', resp); clearCart(); navigate(`/order-confirmed/${r.data.data.order._id}`); } catch { toast.error('Payment failed'); } }, prefill: { name: address.name, contact: address.phone }, theme: { color: '#FF4D8B' } };
        const rzp = new window.Razorpay(opts);
        rzp.open();
      } else { clearCart(); navigate(`/order-confirmed/${r.data.data._id}`); }
    } catch (err) { toast.error(err.response?.data?.message || 'Order failed'); } finally { setLoading(false); }
  };

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="flex items-center gap-4 mb-8 justify-center">{['Delivery', 'Payment', 'Review'].map((s, i) => <div key={s} className={`flex items-center gap-2 ${i + 1 <= step ? 'text-primary' : 'text-text-muted'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 <= step ? 'bg-primary text-white' : 'bg-border'}`}>{i + 1}</div><span className="text-sm font-medium hidden md:inline">{s}</span>{i < 2 && <div className={`w-12 h-0.5 ${i + 1 < step ? 'bg-primary' : 'bg-border'}`} />}</div>)}</div>
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          {step === 1 && <div className="bg-surface-2 rounded-2xl p-6 shadow-card"><h2 className="font-semibold text-lg mb-4">Delivery Address</h2><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-text-muted mb-1 block">Name <span className="text-error">*</span></label><input type="text" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="input" required /></div><div><label className="text-sm text-text-muted mb-1 block">Phone <span className="text-error">*</span></label><input type="tel" inputMode="numeric" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="input" required /></div></div><div><label className="text-sm text-text-muted mb-1 block">Address Line 1 <span className="text-error">*</span></label><input type="text" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} className="input" required /></div><div><label className="text-sm text-text-muted mb-1 block">Address Line 2</label><input type="text" value={address.line2} onChange={e => setAddress({...address, line2: e.target.value})} className="input" /></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label className="text-sm text-text-muted mb-1 block">City <span className="text-error">*</span></label><input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="input" required /></div><div><label className="text-sm text-text-muted mb-1 block">State <span className="text-error">*</span></label><input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="input" required /></div><div><label className="text-sm text-text-muted mb-1 block">Pincode <span className="text-error">*</span></label><input type="text" inputMode="numeric" pattern="[0-9]{6}" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="input" required /></div></div></div><button onClick={() => { if (!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) return toast.error('Please fill all required fields'); setStep(2); }} className="btn-primary mt-6">Continue to Payment</button></div>}
          {step === 2 && <div className="bg-surface-2 rounded-2xl p-6 shadow-card"><h2 className="font-semibold text-lg mb-4">Payment Method</h2><div className="space-y-3">{['razorpay', 'cod', 'card', 'upi'].map(m => <label key={m} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${payment === m ? 'border-primary bg-primary/5' : 'border-border hover:border-primary-light'}`}><input type="radio" name="payment" value={m} checked={payment === m} onChange={e => setPayment(e.target.value)} className="text-primary focus:ring-primary" /><span className="font-medium capitalize">{m === 'cod' ? 'Cash on Delivery' : m === 'razorpay' ? 'Razorpay (UPI/Card/NetBanking)' : m}</span></label>)}</div><div className="flex gap-3 mt-6"><button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button><button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button></div></div>}
          {step === 3 && <div className="bg-surface-2 rounded-2xl p-6 shadow-card"><h2 className="font-semibold text-lg mb-4">Review Order</h2><div className="space-y-3">{items.map((item, i) => { const p = item.productId || {}; return <div key={i} className="flex gap-3 items-center"><div className="w-12 h-12 bg-primary-light/10 rounded-lg overflow-hidden flex-shrink-0"><img src={p.images?.[0] || item.image || ''} alt="" className="w-full h-full object-cover" /></div><div className="flex-1 text-sm"><p className="font-medium truncate">{p.name || item.name}</p><p className="text-text-muted">Qty: {item.quantity}</p></div><p className="font-medium text-sm">{formatPrice((item.price || p.price || 0) * item.quantity)}</p></div>;})}</div><div className="border-t mt-4 pt-4 text-sm space-y-2"><div className="flex justify-between"><span className="text-text-muted">Delivering to</span><span className="font-medium">{address.name}, {address.city}</span></div><div className="flex justify-between"><span className="text-text-muted">Payment</span><span className="font-medium capitalize">{payment === 'cod' ? 'Cash on Delivery' : payment}</span></div></div><div className="flex gap-3 mt-6"><button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button><button onClick={placeOrder} disabled={loading} className="btn-primary flex-1">{loading ? 'Placing...' : `Place Order — ${formatPrice(total)}`}</button></div></div>}
        </div>
        <div className="md:col-span-2"><div className="bg-surface-2 rounded-2xl p-6 shadow-card sticky top-28"><h3 className="font-semibold mb-4">Order Summary</h3><div className="space-y-2 text-sm">{items.map((item, i) => <div key={i} className="flex justify-between"><span className="text-text-muted truncate">{item.productId?.name || item.name} × {item.quantity}</span><span>{formatPrice((item.price || item.productId?.price || 0) * item.quantity)}</span></div>)}</div><div className="border-t mt-4 pt-4 space-y-2 text-sm"><div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}<div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div></div></div></div>
      </div>
    </div>
  );
};

export default Checkout;
