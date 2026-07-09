import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/helpers';
import { useCompare } from '../context/CompareContext';
import { StarRating } from '../components/ui/index';

const Row = ({ label, children }) => (
  <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(0,1fr))] gap-4 border-b border-border py-4 items-center">
    <div className="text-sm font-medium text-text-muted">{label}</div>
    {children}
  </div>
);

const Cell = ({ children, className = '' }) => (
  <div className={`text-sm min-w-0 ${className}`}>{children}</div>
);

const ProductCompare = () => {
  const [sp] = useSearchParams();
  const ids = sp.get('ids')?.split(',').filter(Boolean) || [];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { remove, clear } = useCompare();

  useEffect(() => {
    if (!ids.length) { setLoading(false); return; }
    API.get('/products', { params: { limit: 50 } }).then(r => {
      const all = r.data.data?.products || [];
      setProducts(all.filter(p => ids.includes(p._id)));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [ids.join(',')]);

  if (loading) return <div className="container-custom px-4 py-20 text-center"><div className="skeleton w-16 h-16 rounded-full mx-auto" /></div>;
  if (!products.length) return <div className="container-custom px-4 py-20 text-center text-text-muted">No products to compare</div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title mb-0">Compare Products</h1>
        <div className="flex gap-3">
          <button onClick={clear} className="btn-secondary !py-2 !px-4 text-sm">Clear All</button>
          <Link to="/catalog" className="btn-primary !py-2 !px-4 text-sm">Add More</Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(180px,1fr))] gap-4">
            <div />
            {products.map(p => {
              const v = p.variants?.[0] || {};
              const image = p.images?.[0] || 'https://via.placeholder.com/200';
              return (
                <div key={p._id} className="text-center">
                  <div className="relative">
                    <div className="aspect-square bg-primary-light/10 rounded-2xl overflow-hidden mb-3">
                      <img src={image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <button onClick={() => remove(p._id)} className="absolute -top-2 -right-2 w-7 h-7 bg-error text-white rounded-full flex items-center justify-center shadow-md hover:bg-error/80 transition" aria-label="Remove">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <Link to={`/product/${p._id}`} className="font-medium hover:text-primary transition block truncate">{p.name}</Link>
                  <p className="text-xs text-text-muted mt-0.5">{p.brand}</p>
                  <div className="mt-4">
                    <span className="font-bold text-lg">{formatPrice(v.price || 0)}</span>
                    {v.originalPrice > v.price && <span className="text-xs text-text-muted line-through ml-2">{formatPrice(v.originalPrice)}</span>}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1"><StarRating rating={p.rating?.average || 0} size="sm" /><span className="text-xs text-text-muted">({p.rating?.count || 0})</span></div>
                </div>
              );
            })}
          </div>

          <Row label="Category">
            {products.map(p => <Cell key={p._id} className="capitalize">{p.category}</Cell>)}
          </Row>

          <Row label="Brand">
            {products.map(p => <Cell key={p._id}>{p.brand}</Cell>)}
          </Row>

          <Row label="Description">
            {products.map(p => <Cell key={p._id} className="text-xs text-text-muted leading-relaxed">{p.description}</Cell>)}
          </Row>

          {products.some(p => p.ingredients) && (
            <Row label="Ingredients">
              {products.map(p => <Cell key={p._id} className="text-xs text-text-muted">{p.ingredients || '—'}</Cell>)}
            </Row>
          )}

          {products.some(p => p.howToUse) && (
            <Row label="How to Use">
              {products.map(p => <Cell key={p._id} className="text-xs text-text-muted">{p.howToUse || '—'}</Cell>)}
            </Row>
          )}

          {products.some(p => p.skinTypes?.length) && (
            <Row label="Skin Types">
              {products.map(p => <Cell key={p._id} className="capitalize">{p.skinTypes?.join(', ') || 'All'}</Cell>)}
            </Row>
          )}

          <Row label="Variants">
            {products.map(p => <Cell key={p._id} className="text-text-muted">{p.variants?.map(vt => vt.label).join(', ') || '—'}</Cell>)}
          </Row>

          <Row label="Stock">
            {products.map(p => {
              const total = p.variants?.reduce((s, vt) => s + (vt.stock || 0), 0) || 0;
              return <Cell key={p._id} className={total > 0 ? 'text-success' : 'text-error'}>{total > 0 ? `In Stock (${total})` : 'Out of Stock'}</Cell>;
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductCompare;
