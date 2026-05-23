import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductGrid from '../components/ProductGrid';
import { debounce, categoryLabel } from '../utils/format';
import { filterHairProducts, getHairProducts, sortByTierPriority } from '../data/hairCatalog';
import { PRODUCT_TIERS, TIER_ORDER } from '../data/productTiers';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'hair', label: 'Hair' },
  { id: 'acha', label: 'Acha' },
  { id: 'toilet_paper', label: 'Essentials' },
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);

  const category = searchParams.get('category') || '';
  const tierFilter = searchParams.get('tier') || '';
  const isHairOnly = category === 'hair' || category === '';

  const fetchApiProducts = useMemo(
    () =>
      debounce(async (params) => {
        if (category === 'hair') {
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const { data } = await api.get('/products', { params });
          setApiProducts(data.products || []);
        } catch {
          setApiProducts([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    [category]
  );

  useEffect(() => {
    const params = {};
    if (category && category !== 'hair') params.category = category;
    if (search) params.search = search;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (inStock) params.in_stock = 'true';

    if (category === 'hair') {
      setLoading(false);
      return;
    }

    fetchApiProducts(params);
  }, [category, search, minPrice, maxPrice, inStock, fetchApiProducts]);

  const hairProducts = useMemo(() => {
    const list = filterHairProducts({
      search,
      category: category || 'hair',
      tier: tierFilter || undefined,
    });
    return tierFilter ? list : sortByTierPriority(list);
  }, [search, category, tierFilter]);

  const products = useMemo(() => {
    if (tierFilter) return hairProducts;
    if (category === 'hair') return hairProducts;
    if (category === 'acha' || category === 'toilet_paper') return apiProducts;
    return sortByTierPriority([...hairProducts, ...apiProducts]);
  }, [category, tierFilter, hairProducts, apiProducts]);

  const tierCounts = useMemo(() => {
    const all = filterHairProducts({ search, category: category === 'acha' || category === 'toilet_paper' ? 'hair' : category || 'hair' });
    return Object.fromEntries(
      TIER_ORDER.map((tid) => [tid, all.filter((p) => p.display_tier === tid).length])
    );
  }, [search, category]);

  const setTier = (tier) => {
    const next = new URLSearchParams(searchParams);
    if (tier) next.set('tier', tier);
    else next.delete('tier');
    setSearchParams(next);
  };

  useEffect(() => {
    if (category === 'hair') setLoading(false);
  }, [category]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set('category', cat);
    else next.delete('category');
    setSearchParams(next);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-luxe-brown to-luxe-dark text-luxe-cream py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-luxe-gold uppercase tracking-[0.3em] text-sm mb-4">South Africa&apos;s Premier</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Luxe Beauty & Essentials
          </h1>
          <p className="text-luxe-rose/90 max-w-xl mx-auto text-lg">
            Premium hair extensions, organic acha products & household essentials — delivered nationwide.
          </p>
          <p className="mt-4 text-sm text-luxe-gold">
            Hair prices on WhatsApp inquiry · Free delivery over R999 on essentials
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0 space-y-6">
            <div>
              <h3 className="font-semibold text-luxe-brown mb-3">Categories</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`text-left px-3 py-2 rounded-lg text-sm ${
                      category === cat.id
                        ? 'bg-luxe-brown text-luxe-cream'
                        : 'hover:bg-luxe-rose/50'
                    }`}
                  >
                    {cat.label}
                    {cat.id === 'hair' && (
                      <span className="block text-xs opacity-80">{getHairProducts().length} styles</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {category !== 'hair' && (
              <div>
                <h3 className="font-semibold text-luxe-brown mb-3">Filters</h3>
                <label className="flex items-center gap-2 text-sm mb-3">
                  <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
                  In stock only
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                </div>
              </div>
            )}

            {(isHairOnly || category === 'hair') && (
              <>
                <div>
                  <h3 className="font-semibold text-luxe-brown mb-3">Image quality</h3>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setTier('')}
                      className={`text-left px-3 py-2 rounded-lg text-sm ${
                        !tierFilter ? 'bg-luxe-brown text-luxe-cream' : 'hover:bg-luxe-rose/50'
                      }`}
                    >
                      All styles
                    </button>
                    {TIER_ORDER.map((tid) => (
                      <button
                        key={tid}
                        type="button"
                        onClick={() => setTier(tid)}
                        className={`text-left px-3 py-2 rounded-lg text-sm ${
                          tierFilter === tid ? 'bg-luxe-brown text-luxe-cream' : 'hover:bg-luxe-rose/50'
                        }`}
                      >
                        {PRODUCT_TIERS[tid].label}
                        <span className="block text-xs opacity-75">
                          {tierCounts[tid] ?? 0} styles
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card p-4 bg-[#25D366]/10 border-[#25D366]/30">
                  <p className="text-sm font-medium text-luxe-brown">Hair pricing</p>
                  <p className="text-xs text-gray-600 mt-1">
                    All hair products are priced on inquiry via WhatsApp.
                  </p>
                </div>
              </>
            )}
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  const next = new URLSearchParams(searchParams);
                  if (e.target.value) next.set('q', e.target.value);
                  else next.delete('q');
                  setSearchParams(next);
                }}
                className="input-field flex-1"
              />
            </div>

            {category && (
              <h2 className="text-xl font-display text-luxe-brown mb-4">
                {categoryLabel(category)}
                {category === 'hair' && (
                  <span className="text-sm font-sans text-gray-500 ml-2">
                    ({products.length} — price on WhatsApp)
                  </span>
                )}
              </h2>
            )}

            <ProductGrid products={products} loading={loading && category !== 'hair'} />
          </div>
        </div>
      </div>
    </div>
  );
}
