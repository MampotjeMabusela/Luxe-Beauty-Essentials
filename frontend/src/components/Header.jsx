import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

export default function Header({ onCartOpen }) {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-luxe-rose/40 shadow-sm">
      <div className="site-container">
        <div className="flex items-center justify-between gap-3 min-h-[3.5rem] sm:min-h-[4rem] py-2">
          <Logo variant="header" className="min-w-0 shrink" />

          <nav className="flex items-center gap-3 sm:gap-5 lg:gap-6 text-xs sm:text-sm font-medium shrink-0">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'text-luxe-gold' : 'hover:text-luxe-gold')}>
              Hair
            </NavLink>
            <NavLink to="/essentials" className={({ isActive }) => (isActive ? 'text-luxe-gold' : 'hover:text-luxe-gold')}>
              Essentials
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `hidden sm:inline ${isActive ? 'text-luxe-gold' : 'hover:text-luxe-gold'}`
              }
            >
              Wishlist
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={onCartOpen}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 btn-primary py-2 px-3 sm:px-4 text-xs sm:text-sm relative shrink-0 whitespace-nowrap"
            aria-label={`Open cart, ${itemCount} items`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="hidden xs:inline">Cart</span>
            <span className="xs:hidden">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-luxe-gold text-luxe-dark text-[10px] min-w-[1.1rem] h-[1.1rem] px-1 rounded-full flex items-center justify-center font-bold">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
