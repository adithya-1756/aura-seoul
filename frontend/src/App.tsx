import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public & Customer Pages
import { Home } from './pages/Home';
import { ShopAll } from './pages/ShopAll';
import { CategoryPage } from './pages/CategoryPage';
import { NewArrivals } from './pages/NewArrivals';
import { Trending } from './pages/Trending';
import { BestSellers } from './pages/BestSellers';
import { Sale } from './pages/Sale';
import { ProductDetail } from './pages/ProductDetail';
import { SearchResults } from './pages/SearchResults';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { AccountDashboard } from './pages/AccountDashboard';
import { SavedAddresses } from './pages/SavedAddresses';
import { OrderHistory } from './pages/OrderHistory';
import { OrderDetailView } from './pages/OrderDetailView';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { FAQs } from './pages/FAQs';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsPage } from './pages/TermsPage';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminContent } from './pages/admin/AdminContent';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-aura-offwhite text-aura-black">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  {/* Public Storefront */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<ShopAll />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/new-arrivals" element={<NewArrivals />} />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/best-sellers" element={<BestSellers />} />
                  <Route path="/sale" element={<Sale />} />
                  <Route path="/product/:identifier" element={<ProductDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/order-tracking" element={<OrderTrackingPage />} />

                  {/* Customer Authentication & Dashboard */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/account" element={<AccountDashboard />} />
                  <Route path="/account/addresses" element={<SavedAddresses />} />
                  <Route path="/account/orders" element={<OrderHistory />} />
                  <Route path="/account/orders/:orderId" element={<OrderDetailView />} />

                  {/* Informational & Policy Pages */}
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/size-guide" element={<SizeGuidePage />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Admin Console */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/customers" element={<AdminCustomers />} />
                  <Route path="/admin/inventory" element={<AdminInventory />} />
                  <Route path="/admin/coupons" element={<AdminCoupons />} />
                  <Route path="/admin/content" element={<AdminContent />} />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
