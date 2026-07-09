import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/index';
import API from '../api/axios';
import toast from 'react-hot-toast';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/reviews/my').then(r => setReviews(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const del = async (id) => { if (!confirm('Delete this review?')) return; try { await API.delete(`/reviews/${id}`); setReviews(prev => prev.filter(r => r._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); } };

  if (loading) return <div className="py-20 text-center"><div className="skeleton w-12 h-12 rounded-full mx-auto" /></div>;
  if (!reviews.length) return <div className="container-custom px-4 py-20"><EmptyState icon="✍️" title="No reviews yet" subtitle="Share your experience with products" cta="Browse Products" onCta={() => window.location = '/catalog'} /></div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <h1 className="section-title mb-8">My Reviews</h1>
      <div className="space-y-4">{reviews.map(r => <div key={r._id} className="bg-surface-2 rounded-2xl p-5 shadow-card"><div className="flex gap-4"><Link to={`/product/${r.productId?._id}`} className="w-16 h-16 bg-primary-light/10 rounded-xl overflow-hidden flex-shrink-0"><img src={r.productId?.images?.[0] || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" /></Link><div className="flex-1"><div className="flex items-start justify-between"><div><Link to={`/product/${r.productId?._id}`} className="font-medium text-sm hover:text-primary">{r.productId?.name || 'Product'}</Link><div className="text-accent text-sm mt-0.5">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div></div><button onClick={() => del(r._id)} className="text-xs text-error hover:underline">Delete</button></div><p className="text-text-muted text-sm mt-2">{r.body}</p></div></div></div>)}</div>
    </div>
  );
};

export default MyReviews;
