import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatZAR } from '../utils/format';
import { COMPANY } from '../data/company';
import { buildWhatsAppUrl, cartPurchaseMessage } from '../utils/whatsapp';
import { downloadOrderPdf, generateOrderReference } from '../utils/generateOrderPdf';
import WhatsAppIcon from './WhatsAppIcon';

const CONTACT_KEY = 'luxe_customer_contact';

const emptyContact = {
  fullName: '',
  phone: '',
  email: '',
  city: '',
  notes: '',
};

export default function Cart({ open, onClose }) {
  const { items, subtotal, hasInquiryPricing, removeItem, updateQuantity, clearCart, itemCount } =
    useCart();
  const [customer, setCustomer] = useState(emptyContact);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    try {
      const saved = JSON.parse(localStorage.getItem(CONTACT_KEY));
      if (saved) setCustomer({ ...emptyContact, ...saved });
    } catch {
      /* ignore */
    }
  }, [open]);

  const updateField = (field, value) => {
    setCustomer((c) => ({ ...c, [field]: value }));
  };

  const handlePurchase = async () => {
    setError('');
    if (!customer.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!customer.phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setSubmitting(true);
    try {
      localStorage.setItem(CONTACT_KEY, JSON.stringify(customer));

      const orderRef = generateOrderReference();
      const order = {
        orderRef,
        customer: {
          fullName: customer.fullName.trim(),
          phone: customer.phone.trim(),
          email: customer.email.trim(),
          city: customer.city.trim(),
          notes: customer.notes.trim(),
        },
        items,
        subtotal,
        hasInquiryPricing,
      };

      const pdfName = downloadOrderPdf(order);
      const message = cartPurchaseMessage(order);
      window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');

      alert(
        `Order PDF saved as "${pdfName}".\n\nWhatsApp will open — please attach the PDF from your Downloads folder before sending.`
      );
    } catch (err) {
      setError(err.message || 'Could not complete purchase. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close cart" />

      <aside className="relative w-full sm:max-w-md bg-white h-full max-h-[100dvh] shadow-2xl flex flex-col pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between p-4 border-b bg-luxe-cream/50">
          <h2 className="text-lg font-display font-semibold text-luxe-brown">Your Cart ({itemCount})</h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-luxe-brown">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Company info */}
          <div className="p-4 bg-luxe-brown text-luxe-cream text-sm">
            <p className="font-display font-bold text-luxe-gold text-base">{COMPANY.name}</p>
            <p className="text-luxe-rose/90 text-xs mt-0.5">{COMPANY.tagline}</p>
            <div className="mt-3 space-y-1 text-xs text-luxe-cream/90">
              <p>WhatsApp: {COMPANY.phone}</p>
              <p>Email: {COMPANY.email}</p>
              <p>{COMPANY.website}</p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty — add hair styles from the shop.</p>
            ) : (
              items.map((item) => (
                <div key={item.product_id} className="flex gap-3 border-b border-luxe-rose/30 pb-4">
                  {item.image_urls?.[0] && (
                    <img src={item.image_urls[0]} alt="" className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-luxe-brown line-clamp-2">{item.name}</p>
                    <p className="text-luxe-gold font-semibold text-sm mt-0.5">
                      {item.price_on_inquiry || !item.price ? 'Price on inquiry' : formatZAR(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        className="w-7 h-7 rounded border border-luxe-rose"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        className="w-7 h-7 rounded border border-luxe-rose"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-red-500 hover:underline"
                        onClick={() => removeItem(item.product_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {items.length > 0 && (
              <>
                <div className="border-t border-luxe-rose/40 pt-4">
                  <h3 className="font-semibold text-luxe-brown text-sm mb-3">Your contact details</h3>
                  <div className="space-y-2">
                    <input
                      className="input-field text-sm"
                      placeholder="Full name *"
                      value={customer.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                    />
                    <input
                      className="input-field text-sm"
                      placeholder="Phone / WhatsApp *"
                      value={customer.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                    <input
                      type="email"
                      className="input-field text-sm"
                      placeholder="Email"
                      value={customer.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                    <input
                      className="input-field text-sm"
                      placeholder="City / delivery area"
                      value={customer.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                    <textarea
                      className="input-field text-sm"
                      placeholder="Order notes (length, colour, etc.)"
                      rows={2}
                      value={customer.notes}
                      onChange={(e) => updateField('notes', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3 bg-luxe-cream shrink-0">
            <div className="flex justify-between font-semibold text-luxe-brown">
              <span>Estimated subtotal</span>
              <span>
                {hasInquiryPricing && subtotal === 0
                  ? 'Quoted on WhatsApp'
                  : formatZAR(subtotal)}
              </span>
            </div>
            {hasInquiryPricing && (
              <p className="text-xs text-gray-500">Final prices confirmed when you message us on WhatsApp.</p>
            )}

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="button"
              disabled={submitting}
              onClick={handlePurchase}
              className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-lg
                bg-[#25D366] text-white py-3.5 hover:bg-[#20BD5A] shadow-md transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <WhatsAppIcon className="w-5 h-5" />
              {submitting ? 'Preparing order…' : 'Make a purchase via WhatsApp'}
            </button>
            <p className="text-[10px] text-center text-gray-500 leading-relaxed">
              Downloads a PDF order summary · Opens WhatsApp · Attach the PDF to your message
            </p>
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-xs text-gray-500 hover:text-red-600 py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
