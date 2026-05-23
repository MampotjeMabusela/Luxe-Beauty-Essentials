import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatZAR } from '../utils/format';

export default function Cart({ open, onClose }) {
  const { items, subtotal, removeItem, updateQuantity, coupon, setCoupon, validateCart } = useCart();

  if (!open) return null;

  const handleApplyCoupon = async () => {
    try {
      await validateCart(coupon);
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid coupon');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close cart" />
      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-display font-semibold">Your Cart</h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-luxe-brown">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.product_id} className="flex gap-3 border-b border-luxe-rose/30 pb-4">
                {item.image_urls?.[0] && (
                  <img src={item.image_urls[0]} alt="" className="w-16 h-16 object-cover rounded-lg" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-luxe-gold font-semibold">{formatZAR(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="w-7 h-7 rounded border"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      className="w-7 h-7 rounded border"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-xs text-red-500"
                      onClick={() => removeItem(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3 bg-luxe-cream">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="input-field flex-1 text-sm py-2"
              />
              <button type="button" onClick={handleApplyCoupon} className="btn-outline text-sm py-2 px-3">
                Apply
              </button>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatZAR(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500">Free delivery on orders over R999</p>
            <Link to="/checkout" onClick={onClose} className="btn-primary block text-center w-full">
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
