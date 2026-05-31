/**
 * Luxe Essentials — household products with fixed pricing.
 */
export const ESSENTIALS_CATALOG = [
  {
    id: 'ess-01',
    name: '2Ply 24 Rolls',
    description:
      'Soft 2-ply toilet paper — 24 rolls per pack. Ideal for households and small businesses. Bulk wrapped for easy storage.',
    category: 'essentials',
    image_urls: ['/products/essentials/toilet-paper-24.png'],
    price: 170,
    price_on_inquiry: false,
    badge: 'Best seller',
    rating: 4.9,
    review_count: 12,
    stock_quantity: 99,
  },
  {
    id: 'ess-02',
    name: '1Ply 48 Rolls',
    description:
      'Economical 1-ply toilet paper — 48 rolls per bulk pack. Great value for high-traffic homes, offices, and stock-up shopping.',
    category: 'essentials',
    image_urls: ['/products/essentials/toilet-paper-48-1ply.png'],
    price: 210,
    price_on_inquiry: false,
    badge: 'Value pack',
    rating: 4.8,
    review_count: 8,
    stock_quantity: 99,
  },
];

export function getEssentialsProducts() {
  return [...ESSENTIALS_CATALOG];
}

export function findEssentialProduct(id) {
  return ESSENTIALS_CATALOG.find((item) => item.id === id) || null;
}

export function filterEssentialsProducts({ search }) {
  let list = getEssentialsProducts();
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }
  return list;
}

export function isEssentialsProduct(product) {
  if (!product) return false;
  return product.category === 'essentials' || String(product.id).startsWith('ess-');
}
