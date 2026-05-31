import { Link } from 'react-router-dom';
import { formatZAR } from '../utils/format';
import { useCart } from '../context/CartContext';

export default function EssentialProductCard({ product }) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const image = product.image_urls?.[0];
  const productLink = `/product/${product.id}`;

  return (
    <article className="essential-card group flex flex-col h-full min-w-0">
      <Link to={productLink} className="relative aspect-[4/3] overflow-hidden bg-white block rounded-t-2xl">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-essential-teal text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full max-w-none object-cover group-hover:scale-105 transition-transform duration-400"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-essential-slate/40">No image</div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 bg-white rounded-b-2xl border border-t-0 border-essential-mint/60">
        <Link to={productLink}>
          <h3 className="text-sm sm:text-base font-semibold text-essential-slate line-clamp-2 group-hover:text-essential-teal transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-lg font-bold text-essential-teal">{formatZAR(product.price)}</p>
        <p className="text-xs text-essential-slate/60 mt-0.5">Fixed price · VAT inclusive</p>

        <div className="mt-auto pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => addItem(product)}
            className="essential-btn-primary flex-1 text-sm py-2.5"
          >
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
              isInWishlist(product.id)
                ? 'border-essential-teal text-essential-teal bg-essential-mint/30'
                : 'border-essential-mint text-essential-slate/50 hover:border-essential-teal'
            }`}
            aria-label="Toggle wishlist"
          >
            ♥
          </button>
        </div>
      </div>
    </article>
  );
}
