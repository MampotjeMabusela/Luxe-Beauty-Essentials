/** Display quality tiers for hair product imagery */
export const PRODUCT_TIERS = {
  background: {
    id: 'background',
    label: 'Background',
    shortLabel: 'BG',
    description: 'Catalog & studio backdrop shots',
    badgeClass: 'bg-slate-600/90 text-white border border-slate-400/50',
    cardClass: 'opacity-[0.97] saturate-[0.92]',
    imageClass: 'object-cover',
  },
  '3d': {
    id: '3d',
    label: '3D Effect',
    shortLabel: '3D',
    description: 'Dramatic depth & styled showcase',
    badgeClass: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg',
    cardClass: 'tier-3d',
    imageClass: 'object-cover',
  },
  '4k': {
    id: '4k',
    label: '4K',
    shortLabel: '4K',
    description: 'Ultra-sharp HD product detail',
    badgeClass: 'bg-luxe-dark text-luxe-gold border border-luxe-gold font-bold tracking-wider',
    cardClass: 'ring-2 ring-luxe-gold/40 shadow-md',
    imageClass: 'object-cover contrast-[1.05] brightness-[1.02]',
  },
  special: {
    id: 'special',
    label: 'Special',
    shortLabel: '★',
    description: 'Featured collections & limited picks',
    badgeClass: 'bg-gradient-to-r from-luxe-gold to-amber-500 text-luxe-dark font-bold',
    cardClass: 'ring-2 ring-luxe-gold shadow-lg tier-special',
    imageClass: 'object-cover',
  },
};

export const TIER_ORDER = ['special', '4k', '3d', 'background'];

export function getTierConfig(tier) {
  return PRODUCT_TIERS[tier] || null;
}
