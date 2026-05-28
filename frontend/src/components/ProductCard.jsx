import { Link } from 'react-router-dom';
import { formatZAR } from '../utils/format';
import { useCart } from '../context/CartContext';
import { isInquiryProduct } from '../data/hairCatalog';
import { getTierConfig } from '../data/productTiers';
import InquiryPriceBadge from './InquiryPriceBadge';
import WhatsAppButton from './WhatsAppButton';

export default function ProductCard({ product }) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const image = product.image_urls?.[0];
  const inquiry = isInquiryProduct(product);
  const tierConfig = getTierConfig();
  const lowStock = !inquiry && product.stock_quantity > 0 && product.stock_quantity <= 10;
  const outOfStock = !inquiry && product.stock_quantity === 0;
  const productLink = `/product/${product.id}`;

  return (
    <article className={`card group flex flex-col h-full min-w-0 ${tierConfig.cardClass}`}>
      <Link to={productLink} className="relative aspect-square overflow-hidden bg-luxe-cream block">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className={`w-full h-full max-w-none object-cover group-hover:scale-105 transition-transform duration-500 ${tierConfig.imageClass}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-luxe-rose">No image</div>
        )}

        <span className="absolute top-2 left-2 bg-luxe-dark/85 text-luxe-gold text-[10px] font-bold px-2 py-1 rounded tracking-widest z-10">
          4K
        </span>

        {!inquiry && product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
          <span className="absolute top-2 right-2 bg-luxe-gold text-luxe-dark text-xs font-bold px-2 py-1 rounded z-10">
            SALE
          </span>
        )}
        {lowStock && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
            Low stock
          </span>
        )}
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
        <Link to={productLink}>
          <h3 className="text-sm sm:text-base font-medium text-luxe-brown line-clamp-2 hover:text-luxe-gold">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1 text-sm text-amber-600">
          <span>★</span>
          <span>{product.rating || '—'}</span>
          <span className="text-gray-400">({product.review_count || 0})</span>
        </div>

        {inquiry ? (
          <InquiryPriceBadge className="mt-3" />
        ) : (
          <>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-semibold text-luxe-brown">{formatZAR(product.price)}</span>
              {product.original_price && (
                <span className="text-sm text-gray-400 line-through">{formatZAR(product.original_price)}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">VAT inclusive</p>
          </>
        )}

        <div className="mt-auto pt-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addItem(product)}
            className="btn-primary w-full text-sm py-2"
          >
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
          {inquiry && (
            <WhatsAppButton
              productName={product.name}
              label="Quote"
              className="w-full"
              size="sm"
            />
          )}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-lg border self-end ${isInWishlist(product.id) ? 'border-luxe-gold text-luxe-gold' : 'border-luxe-rose'}`}
            aria-label="Toggle wishlist"
          >
            ♥
          </button>
        </div>
      </div>
    </article>
  );
}
