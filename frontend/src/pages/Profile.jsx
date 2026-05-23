import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SA_PROVINCES } from '../data/provinces';
import { useState } from 'react';
import { authService } from '../services/auth';

export default function Profile() {
  const { user, addresses, loadUser } = useAuth();
  const [address, setAddress] = useState({
    street_address: '',
    city: '',
    province: SA_PROVINCES[0],
    postal_code: '',
    is_default: true,
  });

  if (!user) return <Navigate to="/login" replace />;

  const saveAddress = async (e) => {
    e.preventDefault();
    await authService.addAddress({ ...address, type: 'shipping' });
    await loadUser();
    setAddress({ street_address: '', city: '', province: SA_PROVINCES[0], postal_code: '', is_default: false });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-luxe-brown mb-6">My Profile</h1>
      <div className="card p-6 mb-8">
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
      </div>

      <h2 className="font-semibold mb-4">Saved addresses</h2>
      {addresses?.map((a) => (
        <div key={a.id} className="card p-4 mb-3 text-sm">
          <p>{a.street_address}</p>
          <p>{a.city}, {a.province} {a.postal_code}</p>
          {a.is_default && <span className="text-luxe-gold text-xs">Default</span>}
        </div>
      ))}

      <form onSubmit={saveAddress} className="card p-6 space-y-4">
        <h3 className="font-medium">Add address</h3>
        <input className="input-field" placeholder="Street" value={address.street_address} onChange={(e) => setAddress({ ...address, street_address: e.target.value })} required />
        <input className="input-field" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
        <select className="input-field" value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })}>
          {SA_PROVINCES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <input className="input-field" placeholder="Postal code" value={address.postal_code} onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} />
        <button type="submit" className="btn-primary">Save address</button>
      </form>
    </div>
  );
}
