import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import API from '../../api/axios';
import { formatPrice } from '../../utils/helpers';

const CompareBar = () => {
  const { productIds, count, remove, clear } = useCompare();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (productIds.length === 0) { setProducts([]); return; }
    API.get('/products', { params: { limit: 50 } }).then(r => {
      const all = r.data.data?.products || [];
      setProducts(all.filter(p => productIds.includes(p._id)));
    }).catch(() => {});
  }, [productIds]);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-2/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="container-custom px-4 md:px-8 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {products.map(p => {
            const v = p.variants?.[0] || {};
            return (
              <div key={p._id} className="flex items-center gap-2 bg-surface rounded-xl px-3 py-1.5 flex-shrink-0">
                <div className="w-8 h-8 bg-primary-light/10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={p.images?.[0] || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs min-w-0 max-w-[120px]">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-text-muted">{formatPrice(v.price || 0)}</p>
                </div>
                <button onClick={() => remove(p._id)} className="text-text-muted hover:text-error transition flex-shrink-0" aria-label="Remove">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-text-muted whitespace-nowrap">{count}/4</span>
          <Link to={`/compare?ids=${productIds.join(',')}`} className="btn-primary !py-1.5 !px-4 text-xs whitespace-nowrap">Compare</Link>
          <button onClick={clear} className="text-xs text-text-muted hover:text-error transition whitespace-nowrap">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
