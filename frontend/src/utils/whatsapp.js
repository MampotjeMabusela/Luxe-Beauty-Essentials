/** Luxe Beauty WhatsApp Business — price inquiries */
export const WHATSAPP_NUMBER = '27813601443';
export const WHATSAPP_DISPLAY = '+27 81 360 1443';

export function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function productInquiryMessage(productName) {
  return `Hi Luxe Beauty & Essentials! 👋\n\nI'm interested in:\n*${productName}*\n\nCould you please share the price and availability?\n\nThank you!`;
}

export function generalInquiryMessage() {
  return `Hi Luxe Beauty & Essentials! 👋\n\nI'd like to enquire about your hair products and availability.\n\nThank you!`;
}
