import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import EssentialProductCard from '../components/EssentialProductCard';
import { findHairProduct } from '../data/hairCatalog';
import { findEssentialProduct, isEssentialsProduct } from '../data/essentialsCatalog';

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
        if (String(id).startsWith('ess-')) {
          return findEssentialProduct(id);
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
    <div className="site-container py-6 sm:py-8 w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-display font-bold text-luxe-brown mb-4 sm:mb-6">Wishlist</h1>
      {!wishlist.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No favourites yet</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link to="/" className="btn-primary inline-block">Browse Hair</Link>
            <Link to="/essentials" className="essential-btn-primary inline-block px-6 py-3">Browse Essentials</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
          {products.map((p) =>
            isEssentialsProduct(p) ? (
              <EssentialProductCard key={p.id} product={p} />
            ) : (
              <ProductCard key={p.id} product={p} />
            )
          )}
        </div>
      )}
    </div>
  );
}
