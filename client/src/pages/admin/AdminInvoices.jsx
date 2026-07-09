import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '../../utils/helpers';
import API from '../../api/axios';

const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;
  const print = () => { window.print(); };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-modal p-6 md:p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} id="invoice-print">
        <div className="flex items-center justify-between mb-6 print:hidden"><h2 className="font-semibold text-lg">Invoice</h2><div className="flex gap-3"><button onClick={print} className="btn-primary !py-2 !px-4 text-sm">Print</button><button onClick={onClose} className="btn-secondary !py-2 !px-4 text-sm">Close</button></div></div>

        <div className="border-b pb-6 mb-6 flex items-center justify-between">
          <div><h1 className="font-display text-2xl font-bold" style={{color:'#FF4D8B'}}>Opal</h1><p className="text-xs text-text-muted">Beauty Redefined</p></div>
          <div className="text-right"><p className="font-bold text-lg">INVOICE</p><p className="text-sm text-text-muted">{order.orderNumber}</p></div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div><p className="font-medium mb-1">Bill To:</p><p>{order.address?.name}</p><p>{order.address?.phone}</p><p>{order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ''}</p><p>{order.address?.city}, {order.address?.state} — {order.address?.pincode}</p></div>
          <div className="text-right"><p className="font-medium mb-1">Order Details:</p><p>Date: {formatDate(order.createdAt)}</p><p>Payment: {order.paymentMethod?.toUpperCase()}</p><p className={`font-medium ${order.paymentStatus === 'paid' ? 'text-success' : 'text-error'}`}>{order.paymentStatus?.toUpperCase()}</p></div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead><tr className="border-b border-border"><th className="text-left py-3 font-medium">Item</th><th className="text-left py-3 font-medium hidden sm:table-cell">Variant</th><th className="text-right py-3 font-medium">Qty</th><th className="text-right py-3 font-medium">Price</th><th className="text-right py-3 font-medium">Total</th></tr></thead>
          <tbody>{order.items?.map((item, i) => <tr key={i} className="border-b border-border/50"><td className="py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-light/10 rounded-lg overflow-hidden flex-shrink-0"><img src={item.image || ''} alt="" className="w-full h-full object-cover" /></div><span className="font-medium">{item.name}</span></div></td><td className="py-3 hidden sm:table-cell text-text-muted">{item.variant || '—'}</td><td className="py-3 text-right">{item.quantity}</td><td className="py-3 text-right">{formatPrice(item.price)}</td><td className="py-3 text-right font-medium">{formatPrice(item.price * item.quantity)}</td></tr>)}</tbody>
        </table>

        <div className="border-t pt-4 flex justify-end">
          <div className="w-64 space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>{order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}<div className="flex justify-between"><span>Delivery</span><span>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'FREE'}</span></div><div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div></div>
        </div>

        <div className="mt-8 text-center text-xs text-text-muted border-t pt-4">Thank you for shopping with Opal!</div>
      </div>
    </div>
  );
};

const AdminInvoices = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('paid');

  useEffect(() => { load(); }, [filter]);
  const load = () => { API.get('/admin/invoices', { params: { status: filter || undefined } }).then(r => setOrders(r.data.data?.orders || [])).catch(() => {}).finally(() => setLoading(false)); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1">Invoices</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input !py-2 !w-40 text-sm">
          <option value="">All</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="refunded">Refunded</option><option value="failed">Failed</option>
        </select>
      </div>
      {loading ? <div className="animate-pulse space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      : <div className="space-y-3">{orders.map(o => <div key={o._id} onClick={() => setSelected(o)} className="bg-surface-2 rounded-2xl p-5 shadow-card hover:shadow-hover transition cursor-pointer"><div className="flex items-center justify-between"><div><p className="font-mono text-sm font-medium">{o.orderNumber}</p><p className="text-xs text-text-muted mt-0.5">{o.address?.name} — {formatDate(o.createdAt)}</p></div><div className="text-right"><p className="font-bold">{formatPrice(o.total)}</p><span className={`badge text-xs ${o.paymentStatus === 'paid' ? 'badge-success' : o.paymentStatus === 'pending' ? 'badge-warning' : 'badge-error'}`}>{o.paymentStatus}</span></div></div><div className="flex items-center gap-2 mt-3 text-xs text-text-muted"><span>{o.items?.length} item(s)</span><span>·</span><span>{o.paymentMethod?.toUpperCase()}</span></div></div>)}</div>}
      {selected && <InvoiceModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default AdminInvoices;
