import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice, getFallbackImage } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: CurrencyCode;
  onMoveToBag: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onMoveToBag,
  onRemoveFromWishlist
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <h2 className="font-serif text-xl font-normal text-stone-900 dark:text-stone-100">
                Curated Wishlist
              </h2>
              <span className="text-xs font-mono text-stone-500">
                ({wishlistProducts.length})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-4">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                  No saved creations yet
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs max-w-xs mt-1">
                  Tap the heart icon on any piece to preserve it in your personal collection.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 rounded-sm"
                >
                  <img
                    src={product.images[0] || getFallbackImage(product.title)}
                    alt={product.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackImage(product.title);
                    }}
                    className="w-20 h-24 object-cover rounded-sm bg-stone-100 dark:bg-stone-950"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                          {product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product)}
                          className="text-stone-400 hover:text-rose-500 transition p-1"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {product.category}
                      </p>
                      <p className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100 mt-1">
                        {formatPrice(product.price, currency)}
                      </p>
                    </div>

                    <button
                      onClick={() => onMoveToBag(product)}
                      disabled={!product.inStock}
                      className="mt-2 py-2 px-3 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-950 text-[10px] uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Move to Bag
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={onClose}
              className="w-full py-3 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs uppercase tracking-widest font-semibold rounded-sm transition"
            >
              Continue Browsing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
