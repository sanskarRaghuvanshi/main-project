import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/index';

const ProductGrid = ({ products, loading }) => {
  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{Array.from({length:8}).map((_,i) => <ProductCardSkeleton key={i} />)}</div>;
  if (!products?.length) return <div className="text-center py-16 text-text-muted">No products found</div>;
  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>;
};

export default ProductGrid;
