import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';

const CategoryListing = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get('/products', { params: { category, limit: 50 } }).then(r => setProducts(r.data.data?.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="mb-6"><Link to="/catalog" className="text-sm text-text-muted hover:text-primary">&larr; All Products</Link><h1 className="section-title capitalize mt-1">{category}</h1></div>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};

export default CategoryListing;
