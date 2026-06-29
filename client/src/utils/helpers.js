export const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const getInitials = (name) => (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const truncate = (str, len = 80) => str?.length > len ? str.slice(0, len) + '...' : str;

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getDiscountPercent = (price, original) => original > price ? Math.round((1 - price / original) * 100) : 0;
