import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext(null);

const MAX_COMPARE = 4;

export const CompareProvider = ({ children }) => {
  const [productIds, setProductIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('compareIds') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('compareIds', JSON.stringify(productIds));
  }, [productIds]);

  const add = (id) => {
    if (productIds.includes(id)) { toast('Already in comparison'); return; }
    if (productIds.length >= MAX_COMPARE) { toast.error(`Max ${MAX_COMPARE} products`); return; }
    setProductIds(prev => [...prev, id]);
    toast.success('Added to compare');
  };

  const remove = (id) => {
    setProductIds(prev => prev.filter(p => p !== id));
  };

  const clear = () => {
    setProductIds([]);
    localStorage.removeItem('compareIds');
  };

  return (
    <CompareContext.Provider value={{ productIds, count: productIds.length, add, remove, clear }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
