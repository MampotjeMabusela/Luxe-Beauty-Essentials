import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      setError(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-luxe-brown text-center mb-2">Join Luxe</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Create your account — shop beauty & essentials</p>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            placeholder="First name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Last name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="input-field"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field mb-4"
          required
        />
        <input
          placeholder="Phone (+27...)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input-field mb-4"
        />
        <input
          type="password"
          placeholder="Password (8+ chars, upper, number, special)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-field mb-4"
          required
        />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p className="text-center text-sm mt-6 text-gray-500">
          Already have an account? <Link to="/login" className="text-luxe-gold font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
