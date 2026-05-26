import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppUrl, generalInquiryMessage, WHATSAPP_DISPLAY } from '../utils/whatsapp';

export default function WhatsAppFloat() {
  const href = buildWhatsAppUrl(generalInquiryMessage());

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-[70] group flex items-center gap-0 hover:gap-2
        bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300
        bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]
        p-3 sm:p-4 sm:pl-4 sm:pr-4 sm:hover:pr-5"
      aria-label={`Chat on WhatsApp ${WHATSAPP_DISPLAY}`}
      title={`WhatsApp: ${WHATSAPP_DISPLAY}`}
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
      <span
        className="hidden sm:inline max-w-0 overflow-hidden whitespace-nowrap font-medium text-sm
          group-hover:max-w-[120px] transition-all duration-300"
      >
        Chat with us
      </span>
    </a>
  );
}
