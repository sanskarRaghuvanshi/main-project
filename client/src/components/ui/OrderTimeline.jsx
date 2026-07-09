const statusIcons = {
  pending: '🕐',
  confirmed: '✅',
  dispatched: '📦',
  out_for_delivery: '🚚',
  delivered: '🎉',
  cancelled: '❌',
};

const OrderTimeline = ({ statusHistory, orderStatus }) => {
  if (!statusHistory?.length) return null;
  const cancelled = orderStatus === 'cancelled';

  return (
    <div className="relative">
      {statusHistory.map((entry, i) => {
        const isLast = i === statusHistory.length - 1;
        const isCancelled = entry.status === 'cancelled';
        return (
          <div key={i} className="flex gap-4 pb-6 relative">
            {!isLast && <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 shadow-sm ${
              isCancelled ? 'bg-error text-white' : cancelled && !isLast ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white'
            }`}>
              {isCancelled ? '✕' : '✓'}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <p className={`font-medium text-sm capitalize ${
                  isCancelled ? 'text-error' : isLast ? 'text-text' : 'text-text-muted'
                }`}>
                  {entry.status.replace(/_/g, ' ')}
                </p>
                <span className="text-xs text-text-muted">{new Date(entry.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {entry.note && <p className="text-xs text-text-muted mt-0.5">{entry.note}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
