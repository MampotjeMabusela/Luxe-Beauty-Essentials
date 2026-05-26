/** Luxe Beauty WhatsApp Business — price inquiries */
export const WHATSAPP_NUMBER = '27813601443';
export const WHATSAPP_DISPLAY = '+27 81 360 1443';

export function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function productInquiryMessage(productName) {
  return `Hi Luxe Beauty! 👋\n\nI'm interested in:\n*${productName}*\n\nCould you please share the price and availability?\n\nThank you!`;
}

export function generalInquiryMessage() {
  return `Hi Luxe Beauty! 👋\n\nI'd like to enquire about your hair products and availability.\n\nThank you!`;
}

export function cartPurchaseMessage({ orderRef, customer, items, hasInquiryPricing, subtotal }) {
  const lines = items.map(
    (i, n) =>
      `${n + 1}. ${i.name} × ${i.quantity}${
        i.price_on_inquiry || !i.price ? ' (price on inquiry)' : ` — ${(i.price * i.quantity).toFixed(2)} ZAR`
      }`
  );

  return `Hi Luxe Beauty! 👋

*NEW ORDER REQUEST*
Reference: *${orderRef}*

*Customer details*
Name: ${customer.fullName}
Phone: ${customer.phone}${customer.email ? `\nEmail: ${customer.email}` : ''}${customer.city ? `\nArea: ${customer.city}` : ''}${customer.notes ? `\nNotes: ${customer.notes}` : ''}

*Items*
${lines.join('\n')}

${hasInquiryPricing ? 'Subtotal: *To be quoted*' : `Subtotal: *R${subtotal.toFixed(2)}*`}

I have downloaded the order PDF and will attach it here.

Please confirm availability and final price. Thank you!`;
}
