import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', discountType: 'flat', discountValue: '', minOrderValue: '', maxDiscount: '', expiresAt: '', usageLimit: '' });

  useEffect(() => { load(); }, []);
  const load = () => { API.get('/coupons').then(r => setCoupons(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  const submit = async (e) => {
    e.preventDefault();
    const data = { ...form, discountValue: Number(form.discountValue), minOrderValue: Number(form.minOrderValue) || 0, maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined, usageLimit: Number(form.usageLimit) || 0 };
    try { if (editing) { await API.put(`/coupons/${editing}`, data); toast.success('Updated'); } else { await API.post('/coupons', data); toast.success('Created'); } setShowForm(false); setEditing(null); load(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await API.delete(`/coupons/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-h1">Coupons</h1><button onClick={() => { setShowForm(true); setEditing(null); setForm({ code: '', discountType: 'flat', discountValue: '', minOrderValue: '', maxDiscount: '', expiresAt: '', usageLimit: '' }); }} className="btn-primary">Add Coupon</button></div>
      {showForm && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}><div className="bg-surface-2 rounded-3xl shadow-modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}><h2 className="font-semibold text-lg mb-4">{editing ? 'Edit' : 'Add'} Coupon</h2><form onSubmit={submit} className="space-y-3">
        <div><label className="text-xs text-text-muted block mb-1">Code</label><input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="input !py-2 text-sm" required /></div>
        <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-text-muted block mb-1">Type</label><select value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})} className="input !py-2 text-sm"><option value="flat">Flat</option><option value="percent">Percent</option></select></div><div><label className="text-xs text-text-muted block mb-1">Value</label><input type="number" value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} className="input !py-2 text-sm" required /></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-text-muted block mb-1">Min Order</label><input type="number" value={form.minOrderValue} onChange={e => setForm({...form, minOrderValue: e.target.value})} className="input !py-2 text-sm" /></div><div><label className="text-xs text-text-muted block mb-1">Max Discount</label><input type="number" value={form.maxDiscount} onChange={e => setForm({...form, maxDiscount: e.target.value})} className="input !py-2 text-sm" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-text-muted block mb-1">Expires</label><input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} className="input !py-2 text-sm" required /></div><div><label className="text-xs text-text-muted block mb-1">Usage Limit</label><input type="number" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} className="input !py-2 text-sm" /></div></div>
        <div className="flex gap-3 mt-4"><button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button><button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button></div>
      </form></div></div>}
      {loading ? <div className="animate-pulse space-y-3">{Array.from({length:3}).map((_,i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div> : !coupons.length ? <p className="text-text-muted text-center py-8">No coupons</p> : <div className="grid md:grid-cols-3 gap-4">{coupons.map(c => <div key={c._id} className="bg-surface-2 rounded-2xl p-5 shadow-card"><div className="flex items-center justify-between mb-2"><span className="font-bold text-primary text-lg">{c.code}</span><div className="flex gap-2"><button onClick={() => { setEditing(c._id); setForm({ code: c.code, discountType: c.discountType, discountValue: String(c.discountValue), minOrderValue: String(c.minOrderValue || ''), maxDiscount: String(c.maxDiscount || ''), expiresAt: c.expiresAt?.slice(0,10), usageLimit: String(c.usageLimit || '') }); setShowForm(true); }} className="text-xs text-blue-500 hover:underline">Edit</button><button onClick={() => del(c._id)} className="text-xs text-error hover:underline">Delete</button></div></div><p className="text-sm">{c.discountType === 'flat' ? `₹${c.discountValue} off` : `${c.discountValue}% off`}</p><p className="text-xs text-text-muted mt-1">Min: ₹{c.minOrderValue} | Used: {c.usedCount}/{c.usageLimit || '∞'}</p></div>)}</div>}
    </div>
  );
};

export default AdminCoupons;
