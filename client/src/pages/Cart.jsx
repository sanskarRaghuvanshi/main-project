import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { QuantityCounter, EmptyState } from '../components/ui/index';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, itemCount, subtotal, updateQty, removeItem, clearCart, coupon, setCoupon } = useCart();
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/coupons/available').then(r => setAvailableCoupons(r.data.data || [])).catch(() => {});
  }, []);

  const applyCoupon = async (c) => {
    const couponCode = typeof c === 'string' ? c : c.code;
    if (!couponCode) return;
    setValidating(true);
    try {
      const r = await API.post('/coupons/validate', { code: couponCode, cartTotal: subtotal });
      if (r.data.data?.valid) { setCoupon(r.data.data); toast.success(`Saved ₹${r.data.data.discount}`); setCode(''); setDropdownOpen(false); }
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); } finally { setValidating(false); }
  };

  const discount = coupon?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  if (!items.length) return <div className="container-custom px-4 py-20"><EmptyState icon="🛒" title="Your cart is empty" subtitle="Add some products to get started" cta="Browse Products" onCta={() => navigate('/catalog')} /></div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <h1 className="section-title mb-8">Shopping Cart ({itemCount} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const p = item.productId || {};
            const price = item.price || p.variants?.[0]?.price || 0;
            return (
              <div key={item._id || p._id} className="bg-surface-2 rounded-2xl p-4 flex gap-4 shadow-card">
                <Link to={`/product/${p._id}`} className="w-24 h-24 bg-primary-light/10 rounded-xl overflow-hidden flex-shrink-0"><img src={p.images?.[0] || item.image || ''} alt="" className="w-full h-full object-cover" /></Link>
                <div className="flex-1 min-w-0"><Link to={`/product/${p._id}`}><h3 className="font-medium truncate">{p.name || item.name}</h3></Link>{item.variant && <p className="text-xs text-text-muted">{item.variant}</p>}<p className="font-bold text-primary mt-1">{formatPrice(price)}</p>
                  <div className="flex items-center justify-between mt-3"><QuantityCounter value={item.quantity} onChange={q => updateQty(item._id, q)} /><button onClick={() => removeItem(item._id)} className="text-sm text-text-muted hover:text-error transition">Remove</button></div>
                </div>
                <div className="text-right flex-shrink-0"><p className="font-bold">{formatPrice(price * item.quantity)}</p></div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="bg-surface-2 rounded-2xl p-6 shadow-card sticky top-28">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-success"><span>Discount ({coupon?.code})</span><span>-{formatPrice(discount)}</span></div>}<div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div></div>
            <div className="mt-6">{coupon ? <div className="flex items-center justify-between bg-success/10 rounded-xl px-4 py-2.5"><span className="text-sm text-success font-medium">{coupon.code} applied</span><button onClick={() => setCoupon(null)} className="text-xs text-error">Remove</button></div> : <div className="space-y-2"><div className="flex gap-2"><input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="input !py-2 text-sm flex-1" /><button onClick={() => applyCoupon(code)} disabled={validating || !code} className="btn-secondary text-sm !py-2 !px-4">{validating ? '...' : 'Apply'}</button></div><div className="relative"><button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full flex items-center justify-between text-xs text-text-muted hover:text-primary px-2 py-1.5 rounded-lg border border-border/50 transition"><span>Available coupons ({availableCoupons.length})</span><svg className={`w-3.5 h-3.5 transition ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>{dropdownOpen && <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-surface-2 border border-border rounded-xl shadow-card overflow-hidden max-h-64 overflow-y-auto">{availableCoupons.filter(co => co.isActive !== false).map(co => <button key={co.code} onClick={() => { applyCoupon(co); }} className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-primary/5 transition border-b border-border/50 last:border-0"><div><p className="text-sm font-medium">{co.code}</p><p className="text-xs text-text-muted">{co.discountType === 'flat' ? `₹${co.discountValue} off` : `${co.discountValue}% off`} · Min ₹{co.minOrderValue}</p></div><span className="text-xs text-primary font-medium whitespace-nowrap">Apply</span></button>)}</div>}</div></div>}</div>
            <Link to="/checkout" className="btn-primary w-full mt-6 text-center block">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
