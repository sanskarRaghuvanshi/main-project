import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';

const ProductCard = ({ product, matchScore, reason }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const v = product.variants?.[0] || {};
  const price = v.price || 0;
  const original = v.originalPrice || 0;
  const image = product.images?.[0] || 'https://via.placeholder.com/300';
  const discount = getDiscountPercent(price, original);
  const stock = v.stock || 0;
  const outOfStock = stock < 1;

  return (
    <div className="card group relative">
      {outOfStock && <div className="absolute top-3 left-3 z-10 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Out of Stock</div>}
      {!outOfStock && matchScore && <div className="absolute top-3 left-3 z-10 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{matchScore}% Match</div>}
      {discount > 0 && <div className="absolute top-3 right-3 z-10 bg-error text-white text-xs font-bold px-2 py-1 rounded-full">{discount}% OFF</div>}
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square bg-primary-light/10 overflow-hidden">
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-text-muted uppercase tracking-wide font-medium">{product.brand}</p>
        <Link to={`/product/${product._id}`}><h3 className="font-display text-h3 mt-0.5 line-clamp-1 hover:text-primary transition">{product.name}</h3></Link>
        <div className="flex items-center gap-1 mt-1"><span className="text-accent text-sm">★</span><span className="text-xs text-text-muted">({product.rating?.count || 0})</span></div>
        <div className="flex items-center justify-between mt-3">
          <div><span className="font-bold text-lg">{formatPrice(price)}</span>{original > price && <span className="text-xs text-text-muted line-through ml-2">{formatPrice(original)}</span>}</div>
          {outOfStock ? <span className="text-xs text-error font-medium">Sold Out</span> : <button onClick={e => { e.preventDefault(); addItem(product); }} className="btn-icon !w-8 !h-8" aria-label="Add to cart"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>}
        </div>
        {reason && <p className="text-xs text-text-muted mt-2 italic line-clamp-2">{reason}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
