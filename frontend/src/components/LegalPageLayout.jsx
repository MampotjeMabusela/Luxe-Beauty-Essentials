import { Link } from 'react-router-dom';
import { COMPANY } from '../data/company';

export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="w-full overflow-x-hidden bg-luxe-cream">
      <header className="legal-page__hero">
        <div className="site-container relative z-10 py-10 sm:py-14 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-luxe-rose/90 hover:text-luxe-gold transition-colors mb-6"
          >
            ← Back to shop
          </Link>
          <p className="text-luxe-gold uppercase tracking-[0.25em] text-[10px] sm:text-xs mb-2">
            {COMPANY.name}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-luxe-cream">
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-3 text-sm text-luxe-rose/80">Last updated: {lastUpdated}</p>
          )}
        </div>
      </header>

      <div className="site-container py-8 sm:py-10 lg:py-12">
        <article className="legal-page__content card p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto">
          {children}
        </article>
      </div>
    </div>
  );
}

export function LegalSection({ id, title, children }) {
  return (
    <section id={id} className="legal-section">
      <h2 className="legal-section__title">{title}</h2>
      <div className="legal-section__body">{children}</div>
    </section>
  );
}
