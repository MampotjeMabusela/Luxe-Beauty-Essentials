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

function formatTotalLine({ hasInquiryPricing, subtotal, winterPromo }) {
  if (winterPromo?.hasPromo) {
    if (hasInquiryPricing && winterPromo.pricedSubtotal === 0) {
      return 'Priced items total: *To be quoted with Winter Special applied*';
    }
    return `Winter Special total: *R${winterPromo.total.toFixed(2)}* (saved R${winterPromo.totalDiscount.toFixed(2)})`;
  }
  if (hasInquiryPricing) return 'Subtotal: *To be quoted*';
  return `Subtotal: *R${subtotal.toFixed(2)}*`;
}

function formatPromoBlock(winterPromo) {
  if (!winterPromo?.hasPromo || winterPromo.totalDiscount <= 0) return '';
  const lines = ['*Winter Special*', '• 10% off all products'];
  if (winterPromo.bundleDiscount > 0) {
    lines.push(`• Buy 2 get 50% off 3rd (−R${winterPromo.bundleDiscount.toFixed(2)})`);
  }
  if (winterPromo.winterTenPercentOff > 0) {
    lines.push(`• 10% winter discount (−R${winterPromo.winterTenPercentOff.toFixed(2)})`);
  }
  return `${lines.join('\n')}\n\n`;
}

export function cartPurchaseMessage({
  orderRef,
  customer,
  items,
  hasInquiryPricing,
  subtotal,
  winterPromo,
}) {
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

${formatPromoBlock(winterPromo)}*Items*
${lines.join('\n')}

${formatTotalLine({ hasInquiryPricing, subtotal, winterPromo })}

I have downloaded the order PDF and will attach it here.

Please confirm availability and final price. Thank you!`;
}
