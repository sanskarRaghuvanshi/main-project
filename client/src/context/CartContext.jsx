import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);

  const fetchCart = async () => {
    try {
      if (!localStorage.getItem('token')) return;
      setLoading(true);
      const r = await API.get('/cart');
      setItems(r.data.data?.items || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const addItem = async (product, qty = 1) => {
    try {
      await API.post('/cart/add', { productId: product._id, quantity: qty });
      toast.success('Added to cart!');
      fetchCart();
    } catch { toast.error('Failed to add'); }
  };

  const updateQty = async (itemId, quantity) => {
    try {
      await API.put('/cart/update', { itemId, quantity });
      fetchCart();
    } catch { toast.error('Failed to update'); }
  };

  const removeItem = async (itemId) => {
    try {
      await API.delete(`/cart/remove/${itemId}`);
      toast.success('Removed from cart');
      fetchCart();
    } catch { toast.error('Failed to remove'); }
  };

  const clearCart = async () => {
    try { await API.delete('/cart/clear'); setItems([]); } catch {}
  };

  const subtotal = items.reduce((s, i) => s + (i.price || i.productId?.variants?.[0]?.price || 0) * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return <CartContext.Provider value={{ items, loading, itemCount, subtotal, addItem, updateQty, removeItem, clearCart, fetchCart, coupon, setCoupon }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
