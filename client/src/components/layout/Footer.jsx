import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

const Footer = () => (
  <footer className="bg-text text-white mt-16">
    <div className="container-custom px-4 md:px-8 py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Opal" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-xl text-primary">Opal</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">Beauty redefined. Discover products curated for your unique glow.</p>
        </div>
        <div><h4 className="font-semibold mb-3 text-sm">Shop</h4><ul className="space-y-2 text-sm text-gray-400">{[{l:'Face',v:'face'},{l:'Skin',v:'skin'},{l:'Hair',v:'hair'},{l:'Body',v:'body'}].map(c => <li key={c.v}><Link to={`/catalog/${c.v}`} className="hover:text-primary transition">{c.l}</Link></li>)}</ul></div>
        <div><h4 className="font-semibold mb-3 text-sm">Help</h4><ul className="space-y-2 text-sm text-gray-400">{['Contact Us', 'Shipping', 'Returns', 'FAQ'].map(c => <li key={c}><a href="#" className="hover:text-primary transition">{c}</a></li>)}</ul></div>
        <div><h4 className="font-semibold mb-3 text-sm">Connect</h4><ul className="space-y-2 text-sm text-gray-400">{['Instagram', 'YouTube', 'Twitter'].map(c => <li key={c}><a href="#" className="hover:text-primary transition">{c}</a></li>)}</ul></div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">&copy; 2026 Opal Beauty. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer;
