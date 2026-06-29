import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => (
  <>
    <Navbar />
    <main className="min-h-screen"><Outlet /></main>
    <Footer />
  </>
);

export default Layout;
