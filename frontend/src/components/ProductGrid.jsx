import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  const gridClass =
    'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full max-w-full';

  if (loading) {
    return (
      <div className={gridClass}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse min-w-0">
            <div className="aspect-square bg-luxe-rose/30" />
            <div className="p-3 sm:p-4 space-y-3">
              <div className="h-4 bg-luxe-rose/30 rounded w-3/4" />
              <div className="h-4 bg-luxe-rose/30 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12 sm:py-16 text-gray-500">
        <p className="text-base sm:text-lg">No products found</p>
        <p className="text-sm mt-2">Try adjusting your search</p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
