/**
 * Winter Special promotions — applied to cart items with fixed prices.
 * Inquiry-priced hair items: specials noted on order; final quote via WhatsApp.
 */

export const WINTER_PROMO = {
  title: 'Winter Special',
  tagline: 'Limited-time winter savings on every order',
  tenPercentLabel: '10% off all products',
  bundleLabel: 'Buy any 2, get 50% off the 3rd',
  tenPercentRate: 0.1,
  bundleFraction: 0.5,
};

function getPricedUnits(items) {
  const units = [];
  for (const item of items) {
    if (item.price_on_inquiry || !item.price) continue;
    for (let q = 0; q < item.quantity; q += 1) {
      units.push({
        price: item.price,
        product_id: item.product_id,
        name: item.name,
      });
    }
  }
  return units;
}

function calculateBundleDiscount(units) {
  if (units.length < 3) return { discount: 0, bundlesApplied: 0 };

  const sorted = [...units].sort((a, b) => a.price - b.price);
  let discount = 0;
  let bundlesApplied = 0;

  for (let i = 0; i + 2 < sorted.length; i += 3) {
    discount += sorted[i].price * WINTER_PROMO.bundleFraction;
    bundlesApplied += 1;
  }

  return { discount, bundlesApplied };
}

export function calculateWinterPromo(items) {
  const pricedSubtotal = items.reduce((sum, item) => {
    if (item.price_on_inquiry || !item.price) return sum;
    return sum + item.price * item.quantity;
  }, 0);

  const units = getPricedUnits(items);
  const { discount: bundleDiscount, bundlesApplied } = calculateBundleDiscount(units);
  const afterBundle = Math.max(0, pricedSubtotal - bundleDiscount);
  const winterTenPercentOff = afterBundle * WINTER_PROMO.tenPercentRate;
  const totalDiscount = bundleDiscount + winterTenPercentOff;
  const total = Math.max(0, pricedSubtotal - totalDiscount);

  const hasInquiryItems = items.some((i) => i.price_on_inquiry || !i.price);

  return {
    pricedSubtotal,
    bundleDiscount,
    winterTenPercentOff,
    totalDiscount,
    total,
    bundlesApplied,
    pricedUnitCount: units.length,
    hasPromo: pricedSubtotal > 0,
    hasInquiryItems,
    qualifiesForBundle: units.length >= 3,
  };
}

export function formatPromoSummary(promo) {
  if (!promo?.hasPromo) return '';
  const parts = [WINTER_PROMO.tenPercentLabel];
  if (promo.bundlesApplied > 0) {
    parts.push(`${WINTER_PROMO.bundleLabel} (×${promo.bundlesApplied})`);
  }
  return parts.join(' · ');
}
