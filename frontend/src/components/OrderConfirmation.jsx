import { Link } from 'react-router-dom';
import { formatZAR } from '../utils/format';

export default function OrderConfirmation({ order, eftDetails }) {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl text-green-600">✓</span>
      </div>
      <h1 className="text-2xl font-display font-bold text-luxe-brown">Order Confirmed!</h1>
      <p className="text-gray-600 mt-2">
        Thank you for shopping with Luxe Beauty & Essentials
      </p>

      <div className="card p-6 mt-8 text-left">
        <p className="text-sm text-gray-500">Order number</p>
        <p className="font-mono font-semibold text-lg">{order.order_number}</p>
        <p className="mt-4 text-sm text-gray-500">Total</p>
        <p className="text-2xl font-semibold text-luxe-gold">{formatZAR(order.total)}</p>
        <p className="mt-2 text-sm">
          Status: <span className="capitalize">{order.status}</span> · Payment:{' '}
          <span className="capitalize">{order.payment_status}</span>
        </p>
      </div>

      {eftDetails && (
        <div className="card p-6 mt-4 text-left text-sm space-y-2">
          <h3 className="font-semibold">EFT Payment Details</h3>
          <p>Bank: {eftDetails.bank}</p>
          <p>Account: {eftDetails.account_name}</p>
          <p>Number: {eftDetails.account_number}</p>
          <p>Branch: {eftDetails.branch_code}</p>
          <p className="font-mono font-bold text-luxe-brown">Ref: {eftDetails.reference}</p>
          <p className="text-amber-700">Use this reference exactly when paying.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <Link to={`/orders`} className="btn-primary">
          View orders
        </Link>
        <Link to="/" className="btn-outline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
