import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import { categories, sortOptions, skinTypes } from '../constants/index';

const Catalog = () => {
  const [sp, setSp] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const cat = sp.get('category') || '';
  const sort = sp.get('sort') || '';
  const page = Number(sp.get('page')) || 1;
  const minP = sp.get('minPrice') || '';
  const maxP = sp.get('maxPrice') || '';
  const st = sp.get('skinType') || '';
  const q = sp.get('q') || '';

  const update = (k, v) => { const p = new URLSearchParams(sp); if (v) p.set(k, v); else p.delete(k); if (k !== 'page') p.set('page', '1'); setSp(p); };

  useEffect(() => {
    setLoading(true);
    API.get('/products', { params: { category: cat || undefined, sort: sort || undefined, page, limit: 12, minPrice: minP || undefined, maxPrice: maxP || undefined, skinType: st || undefined, search: q || undefined } })
      .then(r => { setProducts(r.data.data?.products || []); setTotal(r.data.data?.total || 0); setPages(r.data.data?.pages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat, sort, page, minP, maxP, st, q]);

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div><h1 className="section-title capitalize">{cat || (q ? `Search: "${q}"` : 'All Products')}</h1><p className="text-text-muted text-sm mt-1">{total} products</p></div>
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search..." value={q} onChange={e => update('q', e.target.value)} className="input !py-2 !w-40 md:!w-56 text-sm" />
          <select value={sort} onChange={e => update('sort', e.target.value)} className="input !py-2 !w-auto text-sm">{sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-surface-2 rounded-2xl p-5 shadow-card space-y-6 sticky top-28">
            <div><h3 className="font-semibold text-sm mb-3">Categories</h3><div className="space-y-1.5"><button onClick={() => update('category', '')} className={`block text-sm w-full text-left px-2 py-1.5 rounded-lg transition ${!cat ? 'bg-primary text-white' : 'text-text-muted hover:text-primary hover:bg-primary-light/10'}`}>All</button>{categories.map(c => <button key={c.value} onClick={() => update('category', c.value)} className={`block text-sm w-full text-left px-2 py-1.5 rounded-lg capitalize transition ${cat === c.value ? 'bg-primary text-white' : 'text-text-muted hover:text-primary hover:bg-primary-light/10'}`}>{c.label}</button>)}</div></div>
            <div><h3 className="font-semibold text-sm mb-3">Price</h3><div className="flex gap-2"><input type="number" placeholder="Min" value={minP} onChange={e => update('minPrice', e.target.value)} className="input !py-1.5 text-sm w-full" /><input type="number" placeholder="Max" value={maxP} onChange={e => update('maxPrice', e.target.value)} className="input !py-1.5 text-sm w-full" /></div></div>
            <div><h3 className="font-semibold text-sm mb-3">Skin Type</h3><div className="space-y-1.5"><label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer"><input type="radio" name="st" checked={!st} onChange={() => update('skinType', '')} className="text-primary focus:ring-primary" />All</label>{skinTypes.map(t => <label key={t} className="flex items-center gap-2 text-sm text-text-muted cursor-pointer"><input type="radio" name="st" checked={st === t} onChange={() => update('skinType', st === t ? '' : t)} className="text-primary focus:ring-primary" />{t.charAt(0).toUpperCase() + t.slice(1)}</label>)}</div></div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} loading={loading} />
          {pages > 1 && <div className="flex justify-center mt-8 gap-2">{Array.from({length: pages}).map((_, i) => <button key={i} onClick={() => update('page', String(i + 1))} className={`w-10 h-10 rounded-full text-sm font-medium transition ${page === i + 1 ? 'bg-primary text-white' : 'bg-surface-2 text-text-muted hover:text-primary'}`}>{i + 1}</button>)}</div>}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
