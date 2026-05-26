import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { isInquiryProduct } from '../data/hairCatalog';

const CartContext = createContext(null);
const STORAGE_KEY = 'luxe_cart';
const WISHLIST_KEY = 'luxe_wishlist';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [coupon, setCoupon] = useState('');
  const [validated, setValidated] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        const max = product.stock_quantity ?? 99;
        return prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, max) }
            : i
        );
      }
      const inquiry = isInquiryProduct(product);
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: inquiry ? null : parseFloat(product.price) || 0,
          price_on_inquiry: inquiry,
          quantity,
          image_urls: product.image_urls,
          stock_quantity: product.stock_quantity,
          category: product.category,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.product_id !== productId) return i;
          const max = i.stock_quantity ?? 99;
          const qty = Math.max(1, Math.min(quantity, max));
          return { ...i, quantity: qty };
        })
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        if (i.price_on_inquiry || !i.price) return sum;
        return sum + i.price * i.quantity;
      }, 0),
    [items]
  );

  const hasInquiryPricing = useMemo(
    () => items.some((i) => i.price_on_inquiry || !i.price),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const value = {
    items,
    wishlist,
    coupon,
    setCoupon,
    validated,
    subtotal,
    hasInquiryPricing,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist: (id) => wishlist.includes(id),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
