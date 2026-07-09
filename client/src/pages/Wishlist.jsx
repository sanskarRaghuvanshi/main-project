import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { EmptyState } from '../components/ui/index';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => { API.get('/wishlist').then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  const remove = async (pid) => { try { await API.delete(`/wishlist/remove/${pid}`); setItems(prev => prev.filter(i => i.productId?._id !== pid)); toast.success('Removed'); } catch { toast.error('Failed'); } };

  if (loading) return <div className="py-20 text-center"><div className="skeleton w-12 h-12 rounded-full mx-auto" /></div>;
  if (!items.length) return <div className="container-custom px-4 py-20"><EmptyState icon="💝" title="Your wishlist is empty" subtitle="Save products you love" cta="Browse Products" onCta={() => window.location = '/catalog'} /></div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <h1 className="section-title mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(item => {
          const p = item.productId || {};
          return <div key={item._id} className="card"><Link to={`/product/${p._id}`}><div className="aspect-square bg-primary-light/10 overflow-hidden"><img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt="" className="w-full h-full object-cover" /></div></Link><div className="p-4"><p className="text-xs text-text-muted">{p.brand}</p><h3 className="font-medium text-sm line-clamp-1">{p.name}</h3><p className="font-bold mt-1">{formatPrice(p.variants?.[0]?.price || p.price || 0)}</p><div className="flex gap-2 mt-3"><button onClick={() => addItem(p)} className="btn-primary text-xs !py-1.5 !px-3 flex-1">Add to Cart</button><button onClick={() => remove(p._id)} className="text-xs text-text-muted hover:text-error transition">Remove</button></div></div></div>;
        })}
      </div>
    </div>
  );
};

export default Wishlist;
