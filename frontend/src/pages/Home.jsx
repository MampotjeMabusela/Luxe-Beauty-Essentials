import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductAmbientBackground from '../components/ProductAmbientBackground';
import { filterHairProducts, getHairProducts } from '../data/hairCatalog';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const cat = searchParams.get('category');
    const tier = searchParams.get('tier');
    if ((cat && cat !== 'hair') || tier) {
      const next = new URLSearchParams(searchParams);
      next.delete('category');
      next.delete('tier');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const products = useMemo(
    () =>
      filterHairProducts({
        search,
        category: 'hair',
      }),
    [search]
  );

  return (
    <div className="w-full overflow-x-hidden">
      <section className="hero-banner relative isolate overflow-hidden flex items-center w-full">
        <img
          src="/hero-background.png"
          alt=""
          className="hero-banner__image"
          fetchPriority="high"
          decoding="async"
        />

        <div
          className="absolute inset-0 bg-gradient-to-b from-luxe-dark/65 via-luxe-brown/40 to-luxe-cream/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-luxe-dark/35 via-transparent to-luxe-dark/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,20,16,0.35)_100%)]"
          aria-hidden
        />
        <div className="absolute bottom-0 inset-x-0 h-20 sm:h-24 bg-gradient-to-t from-luxe-cream via-luxe-cream/80 to-transparent" aria-hidden />

        <div className="relative z-10 site-container py-10 sm:py-12 lg:py-14 text-center w-full">
          <p className="text-luxe-gold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs mb-3 sm:mb-4 drop-shadow-sm">
            South Africa&apos;s Premier
          </p>
          <h1 className="hero-title font-display font-bold text-luxe-cream mb-3 sm:mb-4 drop-shadow-md max-w-3xl mx-auto">
            Luxe Beauty
          </h1>
          <p className="hero-subtitle text-luxe-rose/95 max-w-lg mx-auto leading-relaxed drop-shadow-sm px-2">
            Premium hair extensions, lace fronts &amp; wigs — delivered nationwide.
          </p>
          <p className="mt-4 sm:mt-5 inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-luxe-gold bg-luxe-dark/40 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-luxe-gold/30 max-w-full">
            <span className="font-bold tracking-widest text-[10px]">4K</span>
            <span className="opacity-90 text-center">Product imagery · Prices on WhatsApp inquiry</span>
          </p>
        </div>
      </section>

      <section className="product-shop-section relative overflow-x-hidden w-full">
        <ProductAmbientBackground />
        <div className="relative z-10 site-container py-6 sm:py-8 lg:py-10 w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
            <aside className="w-full lg:w-56 xl:w-60 shrink-0 space-y-4 lg:space-y-5">
              <div className="card p-4 bg-luxe-cream/90">
                <p className="text-sm font-semibold text-luxe-brown">Our collection</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-luxe-gold mt-1">
                  {getHairProducts().length} styles
                </p>
                <p className="text-xs text-gray-500 mt-1">Hair extensions &amp; wigs</p>
                <p className="text-xs text-luxe-gold font-medium mt-2">All images in 4K quality</p>
              </div>

              <div className="card p-4 bg-[#25D366]/10 border-[#25D366]/30">
                <p className="text-sm font-medium text-luxe-brown">Hair pricing</p>
                <p className="text-xs text-gray-600 mt-1">
                  Hair styles are priced on inquiry — message us on WhatsApp for a quote.
                </p>
              </div>

              <div className="card p-4 bg-[#2D7A62]/10 border-[#2D7A62]/30">
                <p className="text-sm font-medium text-luxe-brown">Luxe Essentials</p>
                <p className="text-xs text-gray-600 mt-1">
                  Toilet paper packs — 2Ply 24 Rolls (R170) &amp; 1Ply 48 Rolls (R210).
                </p>
                <Link
                  to="/essentials"
                  className="inline-block mt-3 text-xs font-semibold text-[#2D7A62] hover:underline"
                >
                  Shop Essentials →
                </Link>
              </div>
            </aside>

            <div className="flex-1 min-w-0 w-full">
              <div className="mb-4 sm:mb-6">
                <input
                  type="search"
                  placeholder="Search hair styles..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    const next = new URLSearchParams(searchParams);
                    if (e.target.value) next.set('q', e.target.value);
                    else next.delete('q');
                    setSearchParams(next);
                  }}
                  className="input-field"
                />
              </div>

              <h2 className="text-lg sm:text-xl font-display text-luxe-cream mb-4 sm:mb-6 drop-shadow-md">
                Hair Collection
                <span className="block sm:inline sm:ml-2 text-sm font-sans text-luxe-rose/90 font-normal mt-1 sm:mt-0">
                  ({products.length} styles · 4K · price on WhatsApp)
                </span>
              </h2>

              <ProductGrid products={products} loading={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
