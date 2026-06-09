import { WINTER_PROMO } from '../utils/winterPromo';

export default function WinterPromoBanner() {
  return (
    <div className="winter-promo-banner" role="region" aria-label="Winter special offers">
      <div className="site-container py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="winter-promo-banner__badge shrink-0" aria-hidden>
              ❄
            </span>
            <div className="min-w-0">
              <p className="winter-promo-banner__title">{WINTER_PROMO.title}</p>
              <p className="winter-promo-banner__subtitle hidden sm:block">{WINTER_PROMO.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <span className="winter-promo-banner__pill">{WINTER_PROMO.tenPercentLabel}</span>
            <span className="winter-promo-banner__pill winter-promo-banner__pill--accent">
              {WINTER_PROMO.bundleLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
