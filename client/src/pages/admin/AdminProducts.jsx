import { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/helpers';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', category: '', description: '', price: '', stock: '', tags: '' });

  useEffect(() => { load(); }, []);
  const load = () => { API.get('/products?limit=100').then(r => setProducts(r.data.data?.products || [])).catch(() => {}).finally(() => setLoading(false)); };
  const submit = async (e) => {
    e.preventDefault();
    const data = { ...form, variants: [{ label: 'Standard', price: Number(form.price), stock: Number(form.stock) }], tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try { if (editing) { await API.put(`/products/${editing}`, data); toast.success('Updated'); } else { await API.post('/products', data); toast.success('Created'); } setShowForm(false); setEditing(null); load(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await API.delete(`/products/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-h1">Products</h1><button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', brand: '', category: '', description: '', price: '', stock: '', tags: '' }); }} className="btn-primary">Add Product</button></div>
      {showForm && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}><div className="bg-surface-2 rounded-3xl shadow-modal p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}><h2 className="font-semibold text-lg mb-4">{editing ? 'Edit' : 'Add'} Product</h2><form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-text-muted block mb-1">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input !py-2 text-sm" required /></div><div><label className="text-xs text-text-muted block mb-1">Brand</label><input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input !py-2 text-sm" required /></div></div>
        <div className="grid grid-cols-3 gap-3"><div><label className="text-xs text-text-muted block mb-1">Category</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input !py-2 text-sm" required /></div><div><label className="text-xs text-text-muted block mb-1">Price</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input !py-2 text-sm" required /></div><div><label className="text-xs text-text-muted block mb-1">Stock</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input !py-2 text-sm" required /></div></div>
        <div><label className="text-xs text-text-muted block mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input !py-2 text-sm" rows={3} required /></div>
        <div><label className="text-xs text-text-muted block mb-1">Tags (comma separated)</label><input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="input !py-2 text-sm" /></div>
        <div className="flex gap-3 mt-4"><button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button><button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button></div>
      </form></div></div>}
      {loading ? <div className="animate-pulse space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div> : <div className="bg-surface-2 rounded-2xl overflow-hidden shadow-card"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left p-4 font-medium">Product</th><th className="text-left p-4 font-medium hidden md:table-cell">Brand</th><th className="text-left p-4 font-medium hidden md:table-cell">Category</th><th className="text-left p-4 font-medium">Price</th><th className="text-left p-4 font-medium">Stock</th><th className="text-left p-4 font-medium">Actions</th></tr></thead><tbody>{products.map(p => <tr key={p._id} className="border-t border-border hover:bg-gray-50"><td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-light/10 rounded-lg overflow-hidden flex-shrink-0"><img src={p.images?.[0] || ''} alt="" className="w-full h-full object-cover" /></div><span className="font-medium truncate max-w-[150px]">{p.name}</span></div></td><td className="p-4 hidden md:table-cell">{p.brand}</td><td className="p-4 hidden md:table-cell">{p.category}</td><td className="p-4">{formatPrice(p.variants?.[0]?.price || 0)}</td><td className="p-4">{p.variants?.[0]?.stock || 0}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => { setEditing(p._id); setForm({ name: p.name, brand: p.brand, category: p.category, description: p.description, price: String(p.variants?.[0]?.price || ''), stock: String(p.variants?.[0]?.stock || ''), tags: p.tags?.join(', ') || '' }); setShowForm(true); }} className="text-blue-500 text-xs hover:underline">Edit</button><button onClick={() => del(p._id)} className="text-error text-xs hover:underline">Delete</button></div></td></tr>)}</tbody></table></div></div>}
    </div>
  );
};

export default AdminProducts;
