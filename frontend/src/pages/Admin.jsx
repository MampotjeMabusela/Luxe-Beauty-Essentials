import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatZAR } from '../utils/format';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    api.get('/admin/dashboard').then(({ data }) => setDashboard(data));
    api.get('/admin/orders').then(({ data }) => setOrders(data.orders));
    api.get('/products', { params: { limit: 50 } }).then(({ data }) => setProducts(data.products));
  }, [isAdmin]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const updateOrderStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    const { data } = await api.get('/admin/orders');
    setOrders(data.orders);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-luxe-brown mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-8 border-b">
        {['dashboard', 'orders', 'products'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 capitalize ${tab === t ? 'border-b-2 border-luxe-gold text-luxe-brown font-semibold' : 'text-gray-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && dashboard && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Orders" value={dashboard.stats.orders} />
          <StatCard label="Products" value={dashboard.stats.products} />
          <StatCard label="Customers" value={dashboard.stats.customers} />
          <StatCard label="Revenue" value={formatZAR(dashboard.stats.revenue)} />
        </div>
      )}

      {tab === 'dashboard' && dashboard?.lowStock?.length > 0 && (
        <div className="card p-6 mb-8">
          <h3 className="font-semibold text-amber-700 mb-4">Low stock alerts</h3>
          <ul className="space-y-2 text-sm">
            {dashboard.lowStock.map((p) => (
              <li key={p.id}>{p.name} — {p.stock_quantity} left</li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-4 flex flex-wrap justify-between gap-4 items-center">
              <div>
                <p className="font-mono font-medium">{order.order_number}</p>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
              </div>
              <p className="font-semibold">{formatZAR(order.total_amount)}</p>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="input-field w-auto py-1 text-sm"
              >
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-luxe-rose/30">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">{formatZAR(p.price)}</td>
                  <td className={`p-2 ${p.stock_quantity <= 10 ? 'text-amber-600 font-medium' : ''}`}>
                    {p.stock_quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-luxe-brown mt-1">{value}</p>
    </div>
  );
}
