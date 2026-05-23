import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../hooks/usePayment';
import PaymentMethod from '../components/PaymentMethod';
import OrderConfirmation from '../components/OrderConfirmation';
import { formatZAR } from '../utils/format';
import { SA_PROVINCES, MAJOR_CITIES } from '../data/provinces';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const { items, subtotal, coupon, validateCart, clearCart, validated } = useCart();
  const { user } = useAuth();
  const { payWithPaystack, payWithEft, loading: payLoading } = usePayment();
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [shipping, setShipping] = useState({
    street_address: '',
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '',
    phone: '',
  });
  const [orderResult, setOrderResult] = useState(null);
  const [eftDetails, setEftDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (!items.length && !orderResult) return <Navigate to="/" replace />;

  const displaySubtotal = validated?.subtotal ?? subtotal;
  const shippingEstimate = displaySubtotal >= 999 ? 0 : 79;
  const estimatedTotal = displaySubtotal + shippingEstimate;

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      await validateCart(coupon);
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        payment_method: paymentMethod,
        shipping_address: shipping,
        coupon_code: coupon || undefined,
      });

      const order = data.order;

      if (paymentMethod === 'paystack') {
        await payWithPaystack(order.id);
        return;
      }

      if (paymentMethod === 'eft') {
        const eftData = await payWithEft(order.id);
        setEftDetails(eftData);
      }

      setOrderResult({ ...order, total: data.order.total || estimatedTotal });
      clearCart();
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.error || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult && step === 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <OrderConfirmation order={orderResult} eftDetails={eftDetails} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-luxe-brown mb-6">Checkout</h1>

      <div className="flex gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 text-center text-xs sm:text-sm py-2 rounded ${
              i <= step ? 'bg-luxe-brown text-luxe-cream' : 'bg-luxe-rose/30'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between card p-4">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatZAR(item.price * item.quantity)}</span>
            </div>
          ))}
          <p className="text-right font-semibold">Subtotal: {formatZAR(displaySubtotal)}</p>
          <button type="button" className="btn-primary w-full" onClick={() => setStep(1)}>
            Continue to shipping
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold">Delivery address</h2>
          <input
            className="input-field"
            placeholder="Street address"
            value={shipping.street_address}
            onChange={(e) => setShipping({ ...shipping, street_address: e.target.value })}
            required
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <select
              className="input-field"
              value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
            >
              {MAJOR_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="input-field"
              value={shipping.province}
              onChange={(e) => setShipping({ ...shipping, province: e.target.value })}
            >
              {SA_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <input
            className="input-field"
            placeholder="Postal code"
            value={shipping.postal_code}
            onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Phone (+27...)"
            value={shipping.phone}
            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
          />
          <p className="text-sm text-gray-500">
            Est. shipping: {shippingEstimate === 0 ? 'FREE' : formatZAR(shippingEstimate)} · Zone based on city
          </p>
          <div className="flex gap-3">
            <button type="button" className="btn-outline flex-1" onClick={() => setStep(0)}>Back</button>
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={!shipping.street_address}
              onClick={() => setStep(2)}
            >
              Continue to payment
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
          <div className="card p-4 bg-luxe-cream">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatZAR(displaySubtotal)}</span></div>
            <div className="flex justify-between mt-2"><span>Shipping (est.)</span><span>{formatZAR(shippingEstimate)}</span></div>
            <div className="flex justify-between mt-2 font-bold text-lg border-t pt-2">
              <span>Total (est.)</span>
              <span className="text-luxe-gold">{formatZAR(estimatedTotal)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Final total calculated at checkout including VAT</p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="btn-outline flex-1" onClick={() => setStep(1)}>Back</button>
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={submitting || payLoading}
              onClick={placeOrder}
            >
              {submitting || payLoading ? 'Processing...' : 'Place order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
