import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppUrl, generalInquiryMessage, WHATSAPP_DISPLAY } from '../utils/whatsapp';

export default function Header({ onCartOpen }) {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-luxe-rose/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display text-luxe-brown font-bold tracking-tight">
              Luxe
            </span>
            <span className="hidden sm:inline text-sm text-luxe-gold uppercase tracking-widest">
              Beauty & Essentials
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-luxe-gold' : 'hover:text-luxe-gold')}>
              Shop
            </NavLink>
            <NavLink to="/?category=hair" className="hover:text-luxe-gold">Hair</NavLink>
            <NavLink to="/?category=acha" className="hover:text-luxe-gold">Acha</NavLink>
            <NavLink to="/?category=toilet_paper" className="hover:text-luxe-gold">Essentials</NavLink>
            {user && (
              <NavLink to="/orders" className={({ isActive }) => (isActive ? 'text-luxe-gold' : 'hover:text-luxe-gold')}>
                Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className="text-luxe-gold font-semibold">Admin</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={buildWhatsAppUrl(generalInquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#25D366] hover:opacity-80 font-medium"
              title={`WhatsApp ${WHATSAPP_DISPLAY}`}
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>
            {user ? (
              <>
                <Link to="/profile" className="text-sm hover:text-luxe-gold hidden sm:block">
                  Hi, {user.first_name || user.email.split('@')[0]}
                </Link>
                <button type="button" onClick={logout} className="text-sm text-gray-500 hover:text-luxe-brown">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium hover:text-luxe-gold">Sign in</Link>
            )}
            <button
              type="button"
              onClick={onCartOpen}
              className="relative p-2 rounded-lg hover:bg-luxe-cream"
              aria-label="Open cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxe-gold text-luxe-dark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
