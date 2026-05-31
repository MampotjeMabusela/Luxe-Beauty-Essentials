import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatZAR } from '../utils/format';
import { isInquiryProduct } from '../data/hairCatalog';
import { isEssentialsProduct } from '../data/essentialsCatalog';
import { findCatalogProduct, isCatalogProductId } from '../data/productCatalog';
import InquiryPriceBadge from '../components/InquiryPriceBadge';
import WhatsAppButton from '../components/WhatsAppButton';
import { getTierConfig } from '../data/productTiers';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: '' });
  const { addItem } = useCart();
  const { user } = useAuth();

  const isCatalog = isCatalogProductId(id);
  const isEssentials = id?.startsWith('ess-');

  useEffect(() => {
    if (isCatalog) {
      setProduct(findCatalogProduct(id));
      setReviews([]);
      return;
    }

    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).catch(() => setProduct(null));
    api.get(`/products/${id}/reviews`).then(({ data }) => setReviews(data.reviews)).catch(() => setReviews([]));
  }, [id, isCatalog]);

  useEffect(() => {
    setSelectedVariantIdx(0);
    setQty(1);
  }, [product?.id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (isCatalog) return;
    if (!user) return alert('Please sign in to leave a review');
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      const { data } = await api.get(`/products/${id}/reviews`);
      setReviews(data.reviews);
      const { data: p } = await api.get(`/products/${id}`);
      setProduct(p);
      setReviewForm({ rating: 5, review_text: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (!product) {
    return (
      <div className={`site-container py-8 animate-pulse ${isEssentials ? 'essentials-page min-h-[40vh]' : ''}`}>
        Loading...
      </div>
    );
  }

  const essentials = isEssentialsProduct(product);
  const inquiry = isInquiryProduct(product);
  const tierConfig = getTierConfig();
  const image = product.image_urls?.[0];
  const lowStock = !inquiry && product.stock_quantity > 0 && product.stock_quantity <= 10;
  const variantPricing = Array.isArray(product.variant_pricing) ? product.variant_pricing : [];
  const hasVariantPricing = variantPricing.length > 0;
  const selectedVariant = hasVariantPricing
    ? variantPricing[Math.min(selectedVariantIdx, variantPricing.length - 1)]
    : null;
  const productForCart = selectedVariant
    ? {
        ...product,
        name: `${product.name} - ${selectedVariant.label}`,
        price: selectedVariant.price,
        price_on_inquiry: false,
      }
    : product;
  const quoteProductName = selectedVariant
    ? `${product.name} - ${selectedVariant.label} (${formatZAR(selectedVariant.price)})`
    : product.name;

  const backLink = essentials ? '/essentials' : '/';
  const backLabel = essentials ? '← Back to Essentials' : '← Back to Hair';

  const qtyControls = (
    <div className="flex items-center border rounded-lg border-essential-mint/80">
      <button type="button" className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
      <span className="px-4">{qty}</span>
      <button
        type="button"
        className="px-3 py-2"
        onClick={() => setQty(Math.min(product.stock_quantity || 99, qty + 1))}
      >
        +
      </button>
    </div>
  );

  const addToCart = (item) => {
    for (let i = 0; i < qty; i++) addItem(item);
  };

  return (
    <div className={`w-full overflow-x-hidden ${essentials ? 'essentials-page' : ''}`}>
      <div className="site-container py-6 sm:py-8">
        <Link
          to={backLink}
          className={`text-sm mb-4 sm:mb-6 inline-block hover:underline ${
            essentials ? 'text-essential-teal' : 'text-luxe-gold'
          }`}
        >
          {backLabel}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          <div
            className={`overflow-hidden relative rounded-2xl ${
              essentials
                ? 'aspect-[4/3] bg-white border border-essential-mint/60 shadow-sm'
                : `card aspect-square bg-luxe-cream ${tierConfig.cardClass}`
            }`}
          >
            {!essentials && (
              <span className="absolute top-4 left-4 z-10 bg-luxe-dark/85 text-luxe-gold text-xs font-bold px-3 py-1.5 rounded tracking-widest">
                4K ULTRA HD
              </span>
            )}
            {essentials && product.badge && (
              <span className="absolute top-4 left-4 z-10 essential-detail-badge">{product.badge}</span>
            )}
            {image && (
              <img
                src={image}
                alt={product.name}
                className={`w-full h-full object-contain ${
                  essentials ? 'bg-white p-4' : `bg-luxe-cream ${tierConfig.imageClass}`
                }`}
              />
            )}
          </div>

          <div>
            {essentials && (
              <p className="essential-detail-badge mb-3 w-fit">Luxe Essentials</p>
            )}
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                essentials ? 'text-essential-slate font-sans' : 'font-display text-luxe-brown'
              }`}
            >
              {product.name}
            </h1>
            <div className={`flex items-center gap-2 mt-2 ${essentials ? 'text-essential-teal' : 'text-amber-600'}`}>
              <span>★ {product.rating}</span>
              <span className="text-gray-400">({product.review_count || 0} reviews)</span>
            </div>

            {inquiry ? (
              <div className="mt-6 space-y-4">
                <InquiryPriceBadge />
                {hasVariantPricing && (
                  <div className="card p-4 bg-luxe-cream/80 border border-luxe-rose/50">
                    <label htmlFor="colour-price" className="block text-sm font-medium text-luxe-brown mb-2">
                      Choose colour and price
                    </label>
                    <select
                      id="colour-price"
                      value={selectedVariantIdx}
                      onChange={(e) => setSelectedVariantIdx(Number(e.target.value))}
                      className="input-field"
                    >
                      {variantPricing.map((option, idx) => (
                        <option key={option.label} value={idx}>
                          {option.label} - {formatZAR(option.price)}
                        </option>
                      ))}
                    </select>
                    {selectedVariant && (
                      <p className="mt-2 text-sm text-luxe-brown">
                        Selected: <strong>{selectedVariant.label}</strong> ({formatZAR(selectedVariant.price)})
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" className="btn-primary flex-1" onClick={() => addToCart(productForCart)}>
                    Add to cart
                  </button>
                  <WhatsAppButton productName={quoteProductName} label="Quote" size="md" className="flex-1" />
                </div>
                <p className="text-sm text-gray-500">
                  Add to cart and complete your order with a PDF summary via WhatsApp.
                </p>
              </div>
            ) : (
              <>
                <p
                  className={`text-3xl font-semibold mt-4 ${
                    essentials ? 'text-essential-teal' : 'text-luxe-gold'
                  }`}
                >
                  {formatZAR(product.price)}
                </p>
                <p className="text-sm text-gray-500">Price includes 15% VAT</p>
                {lowStock && (
                  <p className="text-amber-600 text-sm mt-2">Only {product.stock_quantity} left!</p>
                )}
                <div className="flex items-center gap-4 mt-8">
                  {qtyControls}
                  <button
                    type="button"
                    className={essentials ? 'essential-btn-primary flex-1 py-3' : 'btn-primary flex-1'}
                    disabled={product.stock_quantity === 0}
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </button>
                </div>
                {essentials && (
                  <p className="text-sm text-essential-slate/60 mt-3">
                    Fixed price — add to cart and checkout via WhatsApp with your order PDF.
                  </p>
                )}
              </>
            )}

            <p className={`mt-6 leading-relaxed ${essentials ? 'text-essential-slate/80' : 'text-gray-700'}`}>
              {product.description}
            </p>
          </div>
        </div>

        {!isCatalog && (
          <section className="mt-16">
            <h2 className="text-xl font-display font-semibold mb-6">Customer Reviews</h2>
            {user && (
              <form onSubmit={submitReview} className="card p-6 mb-8 max-w-xl">
                <label className="block text-sm font-medium mb-2">Your rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value, 10) })}
                  className="input-field mb-3"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} stars</option>
                  ))}
                </select>
                <textarea
                  placeholder="Share your experience..."
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                  className="input-field mb-3"
                  rows={3}
                />
                <button type="submit" className="btn-primary">Submit review</button>
              </form>
            )}
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {r.author?.first_name || 'Customer'} {r.author?.last_name?.[0] || ''}.
                    </span>
                    <span className="text-amber-600">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{r.review_text}</p>
                </div>
              ))}
              {!reviews.length && <p className="text-gray-500">No reviews yet. Be the first!</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
