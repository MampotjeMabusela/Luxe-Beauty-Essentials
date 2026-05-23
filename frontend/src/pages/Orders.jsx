import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatZAR } from '../utils/format';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get('/orders').then(({ data }) => {
      setOrders(data.orders);
      setLoading(false);
    });
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-luxe-brown mb-6">Your Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders yet</p>
          <Link to="/" className="btn-primary inline-block mt-4">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-mono font-semibold">{order.order_number}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-ZA')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-luxe-gold">{formatZAR(order.total_amount)}</p>
                  <p className="text-sm capitalize">
                    {order.status} · {order.payment_status}
                  </p>
                </div>
              </div>
              {order.tracking_number && (
                <p className="text-sm mt-2">Tracking: {order.tracking_number}</p>
              )}
              {order.status === 'pending' && (
                <button
                  type="button"
                  className="text-sm text-red-500 mt-2"
                  onClick={async () => {
                    await api.put(`/orders/${order.id}/cancel`);
                    const { data } = await api.get('/orders');
                    setOrders(data.orders);
                  }}
                >
                  Cancel order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
