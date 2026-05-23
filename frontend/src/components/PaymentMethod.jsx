const METHODS = [
  {
    id: 'paystack',
    label: 'Card / Bank (Paystack)',
    description: 'Visa, Mastercard, bank transfer via Paystack',
    icon: '💳',
  },
  {
    id: 'eft',
    label: 'EFT / Bank Transfer',
    description: 'Pay via EFT with a unique reference number',
    icon: '🏦',
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives (selected areas)',
    icon: '💵',
  },
];

export default function PaymentMethod({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-luxe-brown">Payment method</h3>
      {METHODS.map((method) => (
        <label
          key={method.id}
          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            selected === method.id
              ? 'border-luxe-gold bg-luxe-gold/10'
              : 'border-luxe-rose/50 hover:border-luxe-gold/50'
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={method.id}
            checked={selected === method.id}
            onChange={() => onSelect(method.id)}
            className="mt-1"
          />
          <span className="text-2xl">{method.icon}</span>
          <div>
            <p className="font-medium">{method.label}</p>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
