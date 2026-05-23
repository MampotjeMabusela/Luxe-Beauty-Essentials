import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { findHairProduct } from '../data/hairCatalog';

export default function Wishlist() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!wishlist.length) {
      setProducts([]);
      return;
    }
    Promise.all(
      wishlist.map(async (id) => {
        if (String(id).startsWith('hair-')) {
          return findHairProduct(id);
        }
        try {
          const { data } = await api.get(`/products/${id}`);
          return data;
        } catch {
          return null;
        }
      })
    ).then((list) => setProducts(list.filter(Boolean)));
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-luxe-brown mb-6">Wishlist</h1>
      {!wishlist.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No favourites yet</p>
          <Link to="/" className="btn-primary inline-block mt-4">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
