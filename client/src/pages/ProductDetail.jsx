import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { formatPrice, formatDate } from '../utils/helpers';
import { StarRating, QuantityCounter } from '../components/ui/index';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [wished, setWished] = useState(false);
  const [wishToggling, setWishToggling] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([API.get(`/products/${id}`), API.get(`/reviews/product/${id}`)])
      .then(([p, r]) => { setProduct(p.data.data); setReviews(r.data.data?.reviews || []); })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    API.get('/wishlist').then(r => {
      const ids = (r.data.data || []).map(i => i.productId?._id || i.productId);
      setWished(ids.includes(id));
    }).catch(() => {});
  }, [id, user]);

  const toggleWish = async () => {
    if (!user) { toast.error('Login to save items'); return; }
    setWishToggling(true);
    try {
      if (wished) { await API.delete(`/wishlist/remove/${id}`); setWished(false); toast.success('Removed from wishlist'); }
      else { await API.post('/wishlist/add', { productId: id }); setWished(true); toast.success('Added to wishlist!'); }
    } catch { toast.error('Failed'); } finally { setWishToggling(false); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await API.post('/reviews', { productId: id, ...reviewForm });
      setReviews(prev => [r.data.data, ...prev]);
      setReviewForm({ rating: 5, body: '' });
      toast.success('Review submitted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="container-custom px-4 py-8"><div className="grid md:grid-cols-2 gap-8"><div className="skeleton h-96" /><div className="space-y-4"><div className="skeleton h-8 w-3/4" /><div className="skeleton h-4 w-1/4" /><div className="skeleton h-6 w-1/3" /><div className="skeleton h-20" /></div></div></div>;
  if (!product) return <div className="text-center py-20 text-text-muted">Not found</div>;

  const v = product.variants?.[variant] || {};
  const price = v.price || 0;
  const image = product.images?.[img] || product.images?.[0] || 'https://via.placeholder.com/500';

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="text-sm text-text-muted mb-4"><Link to="/catalog" className="hover:text-primary">Catalog</Link> / <span className="text-text font-medium">{product.name}</span></div>
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="aspect-square bg-primary-light/10 rounded-3xl overflow-hidden mb-4"><img src={image} alt={product.name} className="w-full h-full object-cover" /></div>
          {product.images?.length > 1 && <div className="flex gap-3 overflow-x-auto scrollbar-hide">{product.images.map((imgUrl, i) => <button key={i} onClick={() => setImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${img === i ? 'border-primary' : 'border-transparent'}`}><img src={imgUrl} alt="" className="w-full h-full object-cover" /></button>)}</div>}
        </div>
        <div className="md:col-span-5">
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium">{product.brand}</p>
          <h1 className="text-h1 md:text-display mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2"><StarRating rating={product.rating?.average || 0} /><span className="text-sm text-text-muted">({product.rating?.count || 0} reviews)</span></div>
          <div className="mt-4"><span className="text-3xl font-bold text-text">{formatPrice(price)}</span>{v.originalPrice > price && <span className="text-lg text-text-muted line-through ml-3">{formatPrice(v.originalPrice)}</span>}</div>
          {product.variants?.length > 1 && <div className="mt-4"><p className="text-sm font-medium mb-2">Size</p><div className="flex gap-2">{product.variants.map((vt, i) => <button key={i} onClick={() => { setVariant(i); setQty(1); }} className={`px-4 py-2 rounded-xl border-2 text-sm transition ${variant === i ? 'border-primary bg-primary text-white' : 'border-border text-text-muted hover:border-primary'}`}>{vt.label}</button>)}</div></div>}
          <div className="flex items-center gap-4 mt-6">{v.stock > 0 ? <><QuantityCounter value={qty} onChange={setQty} max={v.stock} /><button onClick={() => { addItem(product, qty); setQty(1); }} className="btn-primary flex-1 !py-3.5">Add to Cart — {formatPrice(price * qty)}</button><button onClick={toggleWish} disabled={wishToggling} className={`btn-icon !w-12 !h-12 flex-shrink-0 ${wished ? 'text-error bg-error/5' : 'text-text-muted'}`} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}><svg className="w-5 h-5" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button></> : <button disabled className="btn-primary flex-1 !py-3.5 opacity-50 cursor-not-allowed">Out of Stock</button>}</div>
          <div className="mt-6 space-y-2 text-sm">{v.stock > 0 ? <p className="text-success font-medium">✓ In Stock <span className="text-text-muted font-normal">({v.stock} left)</span></p> : <p className="text-error font-medium">✗ Out of Stock</p>}<p className="text-text-muted">Free delivery above ₹499</p></div>
          {product.description && <div className="mt-6"><h3 className="font-semibold mb-2">Description</h3><p className="text-text-muted text-sm leading-relaxed">{product.description}</p></div>}
          {product.howToUse && <div className="mt-4"><h3 className="font-semibold mb-2">How to Use</h3><p className="text-text-muted text-sm">{product.howToUse}</p></div>}
        </div>
      </div>

      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">Reviews ({reviews.length})</h2>
          <button onClick={toggleWish} disabled={wishToggling} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${wished ? 'border-error bg-error/5 text-error' : 'border-border text-text-muted hover:border-error hover:text-error'}`}>
            <svg className="w-5 h-5" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            {wished ? 'Saved' : 'Save to Wishlist'}
          </button>
        </div>
        <form onSubmit={submitReview} className="bg-surface-2 rounded-2xl p-6 shadow-card mb-8">
          <StarRating rating={reviewForm.rating} interactive onChange={r => setReviewForm({...reviewForm, rating: r})} />
          <textarea value={reviewForm.body} onChange={e => setReviewForm({...reviewForm, body: e.target.value})} className="input mt-3" rows={3} placeholder="Share your experience..." required />
          <button type="submit" disabled={submitting} className="btn-primary mt-3">{submitting ? '...' : 'Submit Review'}</button>
        </form>
        <div className="space-y-4">{reviews.map(r => <div key={r._id} className="bg-surface-2 rounded-xl p-5 shadow-card"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center"><span className="text-primary font-bold text-sm">{r.userId?.name?.[0] || 'U'}</span></div><div><p className="font-medium text-sm">{r.userId?.name || 'Anonymous'}</p><StarRating rating={r.rating} size="sm" /></div><span className="ml-auto text-xs text-text-muted">{formatDate(r.createdAt)}</span></div><p className="text-text-muted text-sm mt-3">{r.body}</p></div>)}</div>
      </section>
    </div>
  );
};

export default ProductDetail;
