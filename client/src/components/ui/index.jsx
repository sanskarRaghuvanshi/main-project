export const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-surface-2 rounded-3xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        {children}
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } } .animate-slide-up { animation: slideUp 0.25s ease-out; }`}</style>
    </div>
  );
};

export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="card p-4"><Skeleton className="w-full aspect-square mb-4" /><Skeleton className="h-3 w-1/3 mb-2" /><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-4 w-1/4" /></div>
);

export const StarRating = ({ rating = 0, interactive = false, onChange, size = 'md' }) => {
  const stars = [1, 2, 3, 4, 5];
  const s = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className={`flex gap-0.5 ${s}`}>
      {stars.map(star => (
        <button key={star} type="button" disabled={!interactive} onClick={() => onChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition ${star <= rating ? 'text-accent' : 'text-gray-200'}`}
        >★</button>
      ))}
    </div>
  );
};

export const QuantityCounter = ({ value, onChange, min = 1, max = 99 }) => (
  <div className="flex items-center border border-border rounded-full overflow-hidden">
    <button onClick={() => value > min && onChange(value - 1)} className="w-9 h-9 flex items-center justify-center text-primary hover:bg-primary-light/20 transition disabled:opacity-30" disabled={value <= min}>−</button>
    <span className="w-10 text-center text-sm font-medium">{value}</span>
    <button onClick={() => value < max && onChange(value + 1)} className="w-9 h-9 flex items-center justify-center text-primary hover:bg-primary-light/20 transition disabled:opacity-30" disabled={value >= max}>+</button>
  </div>
);

export const ProgressBar = ({ step, total }) => (
  <div className="flex gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-primary-light/30'}`} />
    ))}
  </div>
);

export const Breadcrumb = ({ items }) => (
  <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <span>/</span>}
        {item.to ? <a href={item.to} className="hover:text-primary transition">{item.label}</a> : <span className="text-text font-medium">{item.label}</span>}
      </span>
    ))}
  </div>
);

export const EmptyState = ({ icon = '📦', title, subtitle, cta, onCta }) => (
  <div className="text-center py-16">
    <span className="text-5xl">{icon}</span>
    <h3 className="text-h3 mt-4">{title || 'Nothing here'}</h3>
    <p className="text-text-muted mt-2">{subtitle}</p>
    {cta && <button onClick={onCta} className="btn-primary mt-6">{cta}</button>}
  </div>
);
