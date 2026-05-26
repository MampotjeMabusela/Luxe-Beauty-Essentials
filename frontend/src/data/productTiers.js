/** All product imagery is presented in 4K quality */
export const DISPLAY_TIER = '4k';

export const TIER_4K = {
  id: '4k',
  label: '4K',
  description: 'Ultra-sharp HD product detail',
  cardClass: 'ring-2 ring-luxe-gold/40 shadow-md',
  imageClass: 'object-cover contrast-[1.05] brightness-[1.02]',
};

export function getTierConfig() {
  return TIER_4K;
}
