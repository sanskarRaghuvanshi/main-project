import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { ProtectedRoute, AdminRoute } from './components/layout/RouteGuards';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CategoryListing from './pages/CategoryListing';
import ProductDetail from './pages/ProductDetail';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import MyReviews from './pages/MyReviews';

import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';

const App = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-surface"><div className="text-center"><div className="skeleton w-16 h-16 rounded-full mx-auto" /><p className="mt-4 text-text-muted text-sm">Loading Opal...</p></div></div>;

  return (
    <>
      <Helmet><title>Opal — Beauty Redefined</title></Helmet>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />
        <Route path="/quiz/results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />

        <Route element={<Layout />}>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:category" element={<CategoryListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-confirmed/:orderId" element={<ProtectedRoute><OrderConfirmed /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/profile/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/profile/reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminLayout /></AdminRoute></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="coupons" element={<AdminCoupons />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
