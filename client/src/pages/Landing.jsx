import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

const Landing = () => {
  const { user } = useAuth();
  return (
    <div>
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary/5 via-surface to-primary/10 overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse" /><div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} /></div>
        <div className="container-custom px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="" className="h-16 w-16 rounded-full" />
                <span className="font-display text-4xl text-primary font-bold">Opal</span>
              </div>
              <h1 className="text-display text-4xl md:text-display leading-tight">Glow <span className="text-primary">Your Way</span></h1>
              <p className="mt-6 text-lg text-text-muted leading-relaxed max-w-lg">Discover a beauty experience curated just for you. From skincare to makeup, powered by AI, personalized for your unique glow.</p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to={user ? '/home' : '/register'} className="btn-primary text-base !py-3.5 !px-8">{user ? 'Explore Now' : 'Get Started'}</Link>
                <Link to="/catalog" className="btn-secondary text-base !py-3.5 !px-8">Shop Now</Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary to-primary-dark p-3 shadow-hover animate-float"><img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400" alt="Beauty" className="w-full h-full object-cover rounded-full" /></div>
                
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} } .animate-float { animation: float 6s ease-in-out infinite; }`}</style>
      </section>

      <section className="bg-surface-2 border-y border-border overflow-hidden"><div className="container-custom px-4 md:px-8 py-4"><div className="flex gap-12 overflow-x-auto scrollbar-hide text-sm font-medium text-text-muted whitespace-nowrap"><span>✨ Free delivery above ₹499</span><span>✅ 100% Authentic</span><span>🔄 Easy Returns</span><span>🎯 20,000+ Products</span><span>💳 Secure Payments</span></div></div></section>

      <section className="section"><div className="container-custom"><h2 className="section-title text-center">Shop by Category</h2><p className="text-text-muted text-center mt-2">Find exactly what you need</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">{[{label:'Face',val:'face',img:'1596462502278-27bfdc403348'},{label:'Skin',val:'skin',img:'1570194065650-d99fb4ee8e39'},{label:'Hair',val:'hair',img:'1526947425960-945c6e72858f'},{label:'Body',val:'body',img:'1541643600914-78b084683601'}].map(c => <Link key={c.val} to={`/catalog/${c.val}`} className="card group p-4 text-center hover:shadow-hover"><div className="aspect-square bg-gradient-to-br from-primary-light/20 to-primary/5 rounded-xl overflow-hidden mb-3"><img src={`https://images.unsplash.com/photo-${c.img}?w=300`} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div><h3 className="font-display font-semibold">{c.label}</h3></Link>)}</div></div></section>

      <section className="section bg-surface-2"><div className="container-custom text-center"><h2 className="section-title">Find Your Perfect Routine</h2><p className="text-text-muted mt-2">Take our AI-powered Skin Quiz for personalized product recommendations</p><Link to="/quiz" className="btn-gold mt-6 inline-block">Start Skin Quiz</Link></div></section>
    </div>
  );
};

export default Landing;
