import { getTierConfig } from '../data/productTiers';

export default function ProductTierBadge({ tier, className = '' }) {
  const config = getTierConfig(tier);
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md backdrop-blur-sm ${config.badgeClass} ${className}`}
    >
      {tier === 'special' && <span aria-hidden>★</span>}
      {tier === '4k' && <span className="text-[9px] opacity-90">ULTRA</span>}
      {config.label}
    </span>
  );
}
