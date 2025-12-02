import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import Navbar from './customer/components/Navbar'
import Footer from './customer/components/Footer'
import OrderTrackingPopup from './customer/components/OrderTrackingPopup'
import Category from './customer/pages/Category'
import Menu from './customer/pages/Menu'
import Cart from './customer/pages/Cart'
import Payment from './customer/pages/Payment'
import Checkout from './customer/pages/Checkout'
import OrderTracking from './customer/pages/OrderTracking'
import HelpSupport from './customer/pages/HelpSupport'
import TermsConditions from './customer/pages/TermsConditions'
import PrivacyPolicy from './customer/pages/PrivacyPolicy'
import AdminLogin from './admin/pages/AdminLogin'
import Dashboard from './admin/pages/Dashboard'
import SuperAdminDashboard from './superadmin/pages/SuperAdminDashboard'
import MenuManagement from './admin/pages/MenuManagement'
import SalesAnalytics from './admin/pages/SalesAnalytics'
import Reports from './admin/pages/Reports'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import WelcomePage from './customer/components/WelcomePage.jsx'
 
 
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}
 
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isWelcomePage = location.pathname === '/';
 
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {!isAdminRoute && !isWelcomePage && <Navbar />}
      {!isAdminRoute && !isWelcomePage && <OrderTrackingPopup />}
      <main style={{ flex: '1 0 auto', width: '100%', minHeight: 0 }}>
        <Routes>
 
            <Route path="/" element={<WelcomePage />} />

            <Route path="/Category" element={<Category />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="*" element={
              <div className="container py-5 text-center" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1 className="display-1 fw-bold text-muted">404</h1>
                <h2 className="mb-4">Page Not Found</h2>
                <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">Go to Home</Link>
              </div>
            } />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/super-dashboard" element={<SuperAdminDashboard />} />
            <Route path="/admin/menu" element={<MenuManagement />} />
            <Route path="/admin/analytics" element={<SalesAnalytics />} />
            <Route path="/admin/reports" element={<Reports />} />
           
        </Routes>
      </main>
      {!isAdminRoute && !isWelcomePage && <Footer />}
    </div>
  )
}
 
export default App