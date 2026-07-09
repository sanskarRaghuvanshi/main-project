import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CompareBar from '../product/CompareBar';

const Layout = () => (
  <>
    <Navbar />
    <main className="min-h-screen"><Outlet /></main>
    <Footer />
    <CompareBar />
  </>
);

export default Layout;
