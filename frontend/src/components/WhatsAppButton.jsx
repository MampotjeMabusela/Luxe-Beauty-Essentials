import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppUrl, productInquiryMessage } from '../utils/whatsapp';

export default function WhatsAppButton({
  productName,
  label = 'Inquire on WhatsApp',
  className = '',
  size = 'md',
}) {
  const message = productName ? productInquiryMessage(productName) : undefined;
  const href = buildWhatsAppUrl(message || productInquiryMessage('your products'));

  const sizes = {
    sm: 'text-xs px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-medium rounded-lg
        bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-md hover:shadow-lg
        transition-all duration-200 ${sizes[size]} ${className}`}
    >
      <WhatsAppIcon className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      <span>{label}</span>
    </a>
  );
}
