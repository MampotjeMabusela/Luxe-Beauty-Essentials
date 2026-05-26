import { jsPDF } from 'jspdf';
import { COMPANY } from '../data/company';
import { formatZAR } from './format';

export function generateOrderReference() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `LB-${ts}-${rand}`;
}

function linePrice(item) {
  if (item.price_on_inquiry || !item.price) return 'Price on inquiry';
  return formatZAR(item.price);
}

function lineTotal(item) {
  if (item.price_on_inquiry || !item.price) return '—';
  return formatZAR(item.price * item.quantity);
}

/**
 * @param {{ orderRef: string, customer: object, items: array, subtotal: number, hasInquiryPricing: boolean }} order
 */
export function downloadOrderPdf(order) {
  const { orderRef, customer, items, subtotal, hasInquiryPricing } = order;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 18;
  let y = margin;

  const addLine = (text, size = 10, style = 'normal', color = [61, 44, 30]) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, 210 - margin * 2);
    lines.forEach((ln) => {
      if (y > 275) {
        doc.addPage();
        y = margin;
      }
      doc.text(ln, margin, y);
      y += size * 0.45 + 2;
    });
  };

  // Header band
  doc.setFillColor(61, 44, 30);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setTextColor(201, 169, 98);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY.name.toUpperCase(), margin, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY.tagline, margin, 22);
  doc.setTextColor(248, 244, 239);
  doc.text(`Order: ${orderRef}`, margin, 28);

  y = 42;
  doc.setTextColor(61, 44, 30);

  addLine('PURCHASE QUOTATION REQUEST', 14, 'bold');
  addLine(`Date: ${new Date().toLocaleString('en-ZA')}`, 9);
  y += 4;

  addLine('— Company —', 11, 'bold', [201, 169, 98]);
  addLine(`${COMPANY.legalName}`, 10);
  addLine(`WhatsApp: ${COMPANY.phone}`, 10);
  addLine(`Email: ${COMPANY.email}`, 10);
  addLine(`Website: ${COMPANY.website}`, 10);
  addLine(COMPANY.address, 10);
  y += 4;

  addLine('— Customer —', 11, 'bold', [201, 169, 98]);
  addLine(`Name: ${customer.fullName}`, 10);
  addLine(`Phone: ${customer.phone}`, 10);
  if (customer.email) addLine(`Email: ${customer.email}`, 10);
  if (customer.city) addLine(`City / Area: ${customer.city}`, 10);
  if (customer.notes) addLine(`Notes: ${customer.notes}`, 10);
  y += 4;

  addLine('— Order items —', 11, 'bold', [201, 169, 98]);

  // Table header
  doc.setFillColor(248, 244, 239);
  doc.rect(margin, y, 210 - margin * 2, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Product', margin + 2, y + 5.5);
  doc.text('Qty', 130, y + 5.5);
  doc.text('Unit', 145, y + 5.5);
  doc.text('Line', 175, y + 5.5);
  y += 10;

  items.forEach((item, idx) => {
    if (y > 260) {
      doc.addPage();
      y = margin;
    }
    const bg = idx % 2 === 0 ? [255, 255, 255] : [252, 250, 248];
    doc.setFillColor(...bg);
    doc.rect(margin, y - 2, 210 - margin * 2, 10, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const nameLines = doc.splitTextToSize(item.name, 115);
    doc.text(nameLines[0], margin + 2, y + 4);
    doc.text(String(item.quantity), 132, y + 4);
    doc.text(linePrice(item).replace('R', 'R '), 145, y + 4);
    doc.text(lineTotal(item).replace('R', 'R '), 175, y + 4);
    y += nameLines.length > 1 ? 12 : 10;
  });

  y += 4;
  if (hasInquiryPricing) {
    addLine('Subtotal: Prices to be confirmed on WhatsApp', 10, 'bold');
  } else {
    addLine(`Subtotal: ${formatZAR(subtotal)}`, 11, 'bold');
  }
  y += 2;
  addLine(COMPANY.vatNote, 8, 'italic', [120, 120, 120]);
  addLine(COMPANY.popia, 8, 'italic', [120, 120, 120]);
  y += 6;
  addLine(
    'Please confirm this order on WhatsApp. Attach or reference this PDF when messaging us.',
    9,
    'normal',
    [61, 44, 30]
  );

  const filename = `LuxeBeauty-Order-${orderRef}.pdf`;
  doc.save(filename);
  return filename;
}
