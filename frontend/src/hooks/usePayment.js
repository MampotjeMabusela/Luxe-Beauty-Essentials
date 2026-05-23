import { useState } from 'react';
import { paymentService } from '../services/payment';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const payWithPaystack = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await paymentService.initPaystack(orderId);
      window.location.href = data.authorization_url;
      return data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const payWithEft = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await paymentService.initEft(orderId);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { payWithPaystack, payWithEft, loading, error };
}
