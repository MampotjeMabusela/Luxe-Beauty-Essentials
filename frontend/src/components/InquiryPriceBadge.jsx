import { WHATSAPP_DISPLAY } from '../utils/whatsapp';

export default function InquiryPriceBadge({ className = '' }) {
  return (
    <div className={className}>
      <p className="text-lg font-semibold text-luxe-brown">Price on inquiry</p>
      <p className="text-sm text-gray-500 mt-0.5">
        Message us on WhatsApp{' '}
        <span className="text-[#25D366] font-medium">{WHATSAPP_DISPLAY}</span>
      </p>
    </div>
  );
}
