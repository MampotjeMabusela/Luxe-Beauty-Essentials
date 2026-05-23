import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatZAR } from '../utils/format';
import { findHairProduct, isInquiryProduct } from '../data/hairCatalog';
import InquiryPriceBadge from '../components/InquiryPriceBadge';
import WhatsAppButton from '../components/WhatsAppButton';
import ProductTierBadge from '../components/ProductTierBadge';
import { getTierConfig } from '../data/productTiers';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: '' });
  const { addItem } = useCart();
  const { user } = useAuth();

  const isCatalogProduct = id?.startsWith('hair-');

  useEffect(() => {
    if (isCatalogProduct) {
      const catalogItem = findHairProduct(id);
      setProduct(catalogItem);
      setReviews([]);
      return;
    }

    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).catch(() => setProduct(null));
    api.get(`/products/${id}/reviews`).then(({ data }) => setReviews(data.reviews)).catch(() => setReviews([]));
  }, [id, isCatalogProduct]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (isCatalogProduct) return;
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
    return <div className="max-w-7xl mx-auto p-8 animate-pulse">Loading...</div>;
  }

  const inquiry = isInquiryProduct(product);
  const tier = product.display_tier;
  const tierConfig = tier ? getTierConfig(tier) : null;
  const image = product.image_urls?.[0];
  const lowStock = !inquiry && product.stock_quantity > 0 && product.stock_quantity <= 10;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-luxe-gold hover:underline mb-6 inline-block">← Back to shop</Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className={`card aspect-square bg-luxe-cream overflow-hidden relative ${tierConfig?.cardClass || ''}`}>
          {tier && (
            <div className="absolute top-4 left-4 z-10">
              <ProductTierBadge tier={tier} className="text-sm px-3 py-1.5" />
            </div>
          )}
          {image && (
            <img
              src={image}
              alt={product.name}
              className={`w-full h-full object-contain bg-luxe-cream ${tierConfig?.imageClass || ''}`}
            />
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tier && (
              <span className="text-xs text-gray-500">{tierConfig?.description}</span>
            )}
          </div>
          <h1 className="text-3xl font-display font-bold text-luxe-brown">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-amber-600">
            <span>★ {product.rating}</span>
            <span className="text-gray-400">({product.review_count || 0} reviews)</span>
          </div>

          {inquiry ? (
            <div className="mt-6 space-y-4">
              <InquiryPriceBadge />
              <WhatsAppButton
                productName={product.name}
                label="Inquire on WhatsApp"
                size="lg"
                className="w-full sm:w-auto"
              />
              <p className="text-sm text-gray-500">
                Our team will reply with price, length options, and delivery details.
              </p>
            </div>
          ) : (
            <>
              <p className="text-3xl font-semibold text-luxe-gold mt-4">{formatZAR(product.price)}</p>
              <p className="text-sm text-gray-500">Price includes 15% VAT</p>
              {lowStock && (
                <p className="text-amber-600 text-sm mt-2">Only {product.stock_quantity} left!</p>
              )}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center border rounded-lg">
                  <button type="button" className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <span className="px-4">{qty}</span>
                  <button
                    type="button"
                    className="px-3 py-2"
                    onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="btn-primary flex-1"
                  disabled={product.stock_quantity === 0}
                  onClick={() => {
                    for (let i = 0; i < qty; i++) addItem(product);
                  }}
                >
                  Add to cart
                </button>
              </div>
            </>
          )}

          <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {!isCatalogProduct && (
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
  );
}
