import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Cart from './components/Cart';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import Essentials from './pages/Essentials';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import WhatsAppFloat from './components/WhatsAppFloat';
import WinterPromoBanner from './components/WinterPromoBanner';
import WinterDecoration from './components/WinterDecoration';
import Logo from './components/Logo';
import { WHATSAPP_DISPLAY } from './utils/whatsapp';

function Layout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col w-full overflow-x-hidden">
      <Header onCartOpen={() => setCartOpen(true)} />
      <WinterPromoBanner />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/essentials" element={<Essentials />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <footer className="relative w-full bg-gradient-to-b from-luxe-dark via-luxe-brown to-luxe-dark text-luxe-cream py-8 sm:py-10 lg:py-12 border-t border-luxe-gold/20 mt-8 sm:mt-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxe-gold/50 to-transparent" />
        <div className="site-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 text-sm">
          <div>
            <Logo variant="footer" linked={false} />
            <p className="text-luxe-rose/90 leading-relaxed max-w-xs">
              Premium hair extensions &amp; everyday essentials — crafted for South Africa.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Support</p>
            <p>WhatsApp: {WHATSAPP_DISPLAY}</p>
            <p>Email: evemasenya@gmail.com</p>
            <p className="mt-2 text-luxe-rose/80">30-day returns · POPIA compliant</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Delivery</p>
            <p>Zone 1 (JHB, PTA, CPT): R79</p>
            <p>Zone 2 (major cities): R99</p>
            <p>Zone 3 (remote): R149</p>
            <p className="text-luxe-gold mt-1">Free shipping over R999</p>
          </div>
        </div>
        <div className="site-container mt-8 pt-6 border-t border-luxe-gold/15 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <Link to="/terms" className="text-luxe-rose/85 hover:text-luxe-gold transition-colors">
            Terms &amp; Conditions
          </Link>
          <span className="hidden sm:inline text-luxe-rose/40" aria-hidden>
            |
          </span>
          <Link to="/privacy" className="text-luxe-rose/85 hover:text-luxe-gold transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p className="text-center text-xs text-luxe-rose/60 mt-6">© {new Date().getFullYear()} Luxe Beauty. Prices on inquiry via WhatsApp.</p>
        <p className="text-center text-xs text-luxe-rose/50 mt-2 pb-1">Developed By Mampotje Mabusela.</p>
      </footer>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
      <WinterDecoration />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
