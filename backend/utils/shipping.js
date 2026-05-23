const ZONE_1_CITIES = [
  'johannesburg',
  'pretoria',
  'cape town',
  'sandton',
  'centurion',
  'durban',
];

const ZONE_2_CITIES = [
  'bloemfontein',
  'port elizabeth',
  'gqeberha',
  'east london',
  'nelspruit',
  'mbombela',
  'polokwane',
  'kimberley',
  'rustenburg',
  'pietermaritzburg',
];

const SHIPPING_RATES = {
  zone1: 79,
  zone2: 99,
  zone3: 149,
};

const FREE_SHIPPING_THRESHOLD = 999;
const VAT_RATE = 0.15;

function normalizeCity(city = '') {
  return city.trim().toLowerCase();
}

function getDeliveryZone(city) {
  const normalized = normalizeCity(city);
  if (ZONE_1_CITIES.some((c) => normalized.includes(c))) return 'zone1';
  if (ZONE_2_CITIES.some((c) => normalized.includes(c))) return 'zone2';
  return 'zone3';
}

function calculateShipping(subtotal, city) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { amount: 0, zone: getDeliveryZone(city), freeShipping: true };
  }
  const zone = getDeliveryZone(city);
  return {
    amount: SHIPPING_RATES[zone],
    zone,
    freeShipping: false,
  };
}

/** Prices include VAT; extract VAT portion from inclusive subtotal */
function calculateVatFromInclusive(inclusiveAmount) {
  return Math.round((inclusiveAmount - inclusiveAmount / (1 + VAT_RATE)) * 100) / 100;
}

function calculateOrderTotals(subtotal, city) {
  const shipping = calculateShipping(subtotal, city);
  const vatAmount = calculateVatFromInclusive(subtotal);
  const total = subtotal + shipping.amount;

  return {
    subtotal,
    shipping: shipping.amount,
    shippingZone: shipping.zone,
    freeShipping: shipping.freeShipping,
    vatAmount,
    total: Math.round(total * 100) / 100,
  };
}

module.exports = {
  calculateShipping,
  calculateOrderTotals,
  calculateVatFromInclusive,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_RATES,
};
