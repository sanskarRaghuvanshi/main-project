import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import { ProductCardSkeleton } from '../components/ui/index';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products/featured').then(r => setFeatured(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary/5 via-surface to-primary/10">
        <div className="container-custom px-4 md:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'New Arrivals', sub: 'Fresh drops for your routine', color: 'from-primary to-primary-dark', link: '/catalog' },
              { title: 'Skin Quiz', sub: 'Find your perfect match with AI', color: 'from-accent to-orange-500', link: '/quiz' },
              { title: 'Top Rated', sub: 'Loved by thousands', color: 'from-purple-500 to-purple-700', link: '/catalog?sort=rating' },
            ].map((b, i) => (
              <Link key={i} to={b.link} className={`bg-gradient-to-r ${b.color} rounded-2xl p-6 md:p-8 text-white hover:scale-[1.02] transition-transform`}>
                <h2 className="font-display text-xl md:text-2xl font-bold">{b.title}</h2>
                <p className="text-white/80 text-sm mt-1">{b.sub}</p>
                <span className="inline-block mt-3 bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">Explore</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Trending Now</h2>
            <Link to="/catalog" className="text-sm text-primary font-medium hover:underline">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{Array.from({length:4}).map((_,i) => <ProductCardSkeleton key={i} />)}</div>
          ) : <ProductGrid products={featured} />}
        </div>
      </section>

      <section className="section bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container-custom">
          <div className="bg-surface-2 rounded-3xl shadow-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="section-title">Not sure what suits you?</h2>
              <p className="text-text-muted mt-2">Take our AI-powered Skin Quiz for personalized recommendations</p>
              <Link to="/quiz" className="btn-primary mt-4 inline-block">Take the Quiz</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300" alt="Skin Quiz" className="rounded-xl w-48 h-48 object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
