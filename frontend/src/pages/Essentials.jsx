import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EssentialProductCard from '../components/EssentialProductCard';
import { filterEssentialsProducts, getEssentialsProducts } from '../data/essentialsCatalog';

export default function Essentials() {
  const [search, setSearch] = useState('');

  const products = useMemo(() => filterEssentialsProducts({ search }), [search]);
  const total = getEssentialsProducts().length;

  return (
    <div className="w-full overflow-x-hidden essentials-page">
      {/* Hero — clean household aesthetic, distinct from hair shop */}
      <section className="essentials-hero">
        <div className="site-container relative z-10 py-10 sm:py-14 lg:py-16">
          <div className="max-w-2xl">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-essential-teal/80 hover:text-essential-teal mb-4 transition-colors"
            >
              ← Back to Hair
            </Link>
            <p className="text-essential-teal font-semibold uppercase tracking-[0.2em] text-xs mb-2">
              Luxe Essentials
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-essential-slate tracking-tight">
              Everyday essentials,<br className="hidden sm:block" /> delivered with care
            </h1>
            <p className="mt-4 text-essential-slate/70 text-base sm:text-lg leading-relaxed max-w-lg">
              Household must-haves at clear, fixed prices. No inquiry needed — add to cart and order via WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="essentials-pill">Fixed pricing</span>
              <span className="essentials-pill">Nationwide delivery</span>
              <span className="essentials-pill">Bulk packs available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="essentials-shop">
        <div className="site-container py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-essential-slate">Shop Essentials</h2>
              <p className="text-sm text-essential-slate/60 mt-1">
                {total} products · clear prices · ready to order
              </p>
            </div>
            <input
              type="search"
              placeholder="Search essentials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="essential-input max-w-full sm:max-w-xs"
            />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-essential-slate/50">
              <p className="text-lg">No products found</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {products.map((product) => (
                <EssentialProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 sm:mt-12 essential-info-banner">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-essential-slate">Need hair instead?</p>
                <p className="text-sm text-essential-slate/60 mt-1">
                  Browse our premium hair collection with 4K imagery and WhatsApp quotes.
                </p>
              </div>
              <Link to="/" className="essential-btn-outline shrink-0 text-center">
                View Hair Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
