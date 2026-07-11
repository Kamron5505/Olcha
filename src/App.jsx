import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import Layout from './layout/Layout';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import PromotionsPage from './pages/PromotionsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';
import DeliveryPage from './pages/DeliveryPage';
import ContactsPage from './pages/ContactsPage';
import InstallmentPage from './pages/InstallmentPage';
import ReturnPage from './pages/ReturnPage';
import WarrantyPage from './pages/WarrantyPage';
import HowToOrderPage from './pages/HowToOrderPage';
import SimpleInfoPage from './pages/SimpleInfoPage';
import NotFoundPage from './pages/NotFoundPage';

const INFO_ROUTES = [
  '/jobs', '/partners', '/blog',
  '/privacy', '/terms',
  '/notifications', '/orders', '/addresses',
  '/payment-methods', '/settings', '/forgot-password',
];

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/promotions/:id" element={<PromotionsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/installment" element={<InstallmentPage />} />
              <Route path="/return" element={<ReturnPage />} />
              <Route path="/warranty" element={<WarrantyPage />} />
              <Route path="/how-to-order" element={<HowToOrderPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              
              {INFO_ROUTES.map((path) => (
                <Route key={path} path={path} element={<SimpleInfoPage />} />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
