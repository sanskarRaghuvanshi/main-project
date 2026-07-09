import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/helpers';
import API from '../../api/axios';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7');

  useEffect(() => {
    setLoading(true);
    const end = new Date().toISOString();
    const start = new Date(Date.now() - Number(range) * 86400000).toISOString();
    API.get('/admin/revenue', { params: { start, end } }).then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [range]);

  if (loading) return <div className="animate-pulse"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div><div className="skeleton h-64 rounded-2xl mb-8" /><div className="skeleton h-48 rounded-2xl" /></div>;

  if (!data) return <div className="text-center py-20 text-text-muted">No data available</div>;

  const maxDailyRev = Math.max(...(data.daily?.map(d => d.revenue) || [0]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1">Reports & Profit</h1>
        <select value={range} onChange={e => setRange(e.target.value)} className="input !py-2 !w-36 text-sm">
          <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-success/10 rounded-2xl p-5 shadow-card"><p className="text-xs text-success font-medium">Total Revenue</p><p className="text-2xl font-bold mt-1">{formatPrice(data.revenue)}</p></div>
        <div className="bg-primary/10 rounded-2xl p-5 shadow-card"><p className="text-xs text-primary font-medium">Net Profit</p><p className="text-2xl font-bold mt-1">{formatPrice(data.profit)}</p></div>
        <div className="bg-[#FFB347]/20 rounded-2xl p-5 shadow-card"><p className="text-xs text-[#FFB347] font-medium">Orders</p><p className="text-2xl font-bold mt-1">{data.orderCount}</p></div>
        <div className="bg-blue-100 rounded-2xl p-5 shadow-card"><p className="text-xs text-blue-600 font-medium">Avg Order Value</p><p className="text-2xl font-bold mt-1">{data.orderCount ? formatPrice(Math.round(data.revenue / data.orderCount)) : '—'}</p></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-2 rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Revenue Trend</h2>
          {data.daily?.length > 0 ? <div className="flex items-end gap-1 h-40">{data.daily.map((d, i) => <div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-primary/20 rounded-t-md relative" style={{ height: `${(d.revenue / maxDailyRev) * 100}%`, minHeight: '4px' }} title={`${formatPrice(d.revenue)}`}><div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium opacity-0 group-hover:opacity-100">{formatPrice(d.revenue)}</div></div><span className="text-[10px] text-text-muted truncate w-full text-center">{d._id.slice(5)}</span></div>)}</div> : <p className="text-sm text-text-muted">No data for this period</p>}
        </div>

        <div className="bg-surface-2 rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Top Products</h2>
          {data.topProducts?.length > 0 ? <div className="space-y-3">{data.topProducts.slice(0, 5).map((p, i) => <div key={i} className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-[#FFB347] text-white' : i === 1 ? 'bg-gray-300 text-gray-600' : i === 2 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</div><div><p className="text-sm font-medium">{p._id}</p><p className="text-xs text-text-muted">{p.qty} sold</p></div></div><span className="font-bold text-sm">{formatPrice(p.revenue)}</span></div>)}</div> : <p className="text-sm text-text-muted">No products sold yet</p>}
        </div>
      </div>

      <div className="bg-surface-2 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4"><h2 className="font-semibold">Recent Orders</h2><Link to="/admin/orders" className="text-sm text-primary hover:underline">View All</Link></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-3 font-medium">Order</th><th className="text-left py-3 font-medium hidden md:table-cell">Customer</th><th className="text-left py-3 font-medium">Date</th><th className="text-right py-3 font-medium">Amount</th></tr></thead><tbody>{data.recentOrders?.map(o => <tr key={o._id} className="border-b border-border/50"><td className="py-3 font-mono text-xs">{o.orderNumber || `#${o._id.slice(-8)}`}</td><td className="py-3 hidden md:table-cell text-text-muted">{o.userId?.name || '—'}</td><td className="py-3 text-text-muted">{formatDate(o.createdAt)}</td><td className="py-3 text-right font-medium">{formatPrice(o.total)}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
};

export default AdminReports;
