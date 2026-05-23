import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppUrl, generalInquiryMessage, WHATSAPP_DISPLAY } from '../utils/whatsapp';

export default function WhatsAppFloat() {
  const href = buildWhatsAppUrl(generalInquiryMessage());

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[70] group flex items-center gap-0 hover:gap-3
        bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300 pl-4 pr-4 py-4 hover:pr-5"
      aria-label={`Chat on WhatsApp ${WHATSAPP_DISPLAY}`}
      title={`WhatsApp: ${WHATSAPP_DISPLAY}`}
    >
      <WhatsAppIcon className="w-7 h-7 shrink-0" />
      <span
        className="max-w-0 overflow-hidden whitespace-nowrap font-medium text-sm
          group-hover:max-w-[140px] transition-all duration-300"
      >
        Chat with us
      </span>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
        <span className="relative inline-flex rounded-full h-4 w-4 bg-luxe-gold border-2 border-[#25D366]" />
      </span>
    </a>
  );
}
