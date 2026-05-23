import { Link } from 'react-router-dom';
import { formatZAR } from '../utils/format';
import { useCart } from '../context/CartContext';
import { isInquiryProduct } from '../data/hairCatalog';
import { getTierConfig } from '../data/productTiers';
import InquiryPriceBadge from './InquiryPriceBadge';
import WhatsAppButton from './WhatsAppButton';
import ProductTierBadge from './ProductTierBadge';

export default function ProductCard({ product }) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const image = product.image_urls?.[0];
  const inquiry = isInquiryProduct(product);
  const tier = product.display_tier;
  const tierConfig = tier ? getTierConfig(tier) : null;
  const lowStock = !inquiry && product.stock_quantity > 0 && product.stock_quantity <= 10;
  const outOfStock = !inquiry && product.stock_quantity === 0;
  const productLink = `/product/${product.id}`;

  return (
    <article className={`card group flex flex-col h-full ${tierConfig?.cardClass || ''}`}>
      <Link to={productLink} className="relative aspect-square overflow-hidden bg-luxe-cream block">
        <div className={`tier-image-wrap w-full h-full ${tier === '3d' ? 'origin-center' : ''}`}>
          {image ? (
            <img
              src={image}
              alt={product.name}
              className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${tierConfig?.imageClass || 'object-cover'}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-luxe-rose">No image</div>
          )}
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {tier && <ProductTierBadge tier={tier} />}
          {inquiry && !tier && (
            <span className="bg-[#25D366] text-white text-xs font-bold px-2 py-1 rounded">
              WhatsApp
            </span>
          )}
        </div>

        {tier === '4k' && (
          <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded bg-black/70 text-luxe-gold text-[10px] font-bold tracking-widest">
            HD
          </div>
        )}

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

      <div className="p-4 flex flex-col flex-1 relative z-[2]">
        <Link to={productLink}>
          <h3 className="font-medium text-luxe-brown line-clamp-2 hover:text-luxe-gold">{product.name}</h3>
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

        <div className="mt-auto pt-4 flex gap-2">
          {inquiry ? (
            <WhatsAppButton
              productName={product.name}
              label="Get price"
              className="flex-1 w-full"
              size="sm"
            />
          ) : (
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => addItem(product)}
              className="btn-primary flex-1 text-sm py-2"
            >
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
          )}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-lg border ${isInWishlist(product.id) ? 'border-luxe-gold text-luxe-gold' : 'border-luxe-rose'}`}
            aria-label="Toggle wishlist"
          >
            ♥
          </button>
        </div>
      </div>
    </article>
  );
}
