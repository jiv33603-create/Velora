import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice, getFallbackImage } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const primaryImage = (product.images && product.images[0]) || getFallbackImage(product.title);
  const secondaryImage = (product.images && product.images[1]) || primaryImage;

  return (
    <div 
      className="group flex flex-col bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-stone-300 dark:hover:border-stone-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] bg-stone-100 dark:bg-stone-950 overflow-hidden cursor-pointer">
        <img
          src={imgError ? getFallbackImage(product.title) : (isHovered ? secondaryImage : primaryImage)}
          alt={product.title}
          loading="lazy"
          onError={() => setImgError(true)}
          onClick={() => onQuickView(product)}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 max-w-[70%]">
          {product.badge && (
            <span className="bg-stone-900/90 text-stone-100 dark:bg-amber-500/90 dark:text-stone-950 text-[8px] sm:text-[10px] font-semibold tracking-wider sm:tracking-widest uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 backdrop-blur-sm rounded-sm truncate">
              {product.badge}
            </span>
          )}
          {typeof product.stockCount === 'number' && product.stockCount <= 4 && product.inStock && (
            <span className="bg-amber-900/90 text-amber-100 text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 backdrop-blur-sm rounded-sm">
              Only {product.stockCount} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-colors duration-200 z-10 ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 dark:bg-stone-900 dark:text-rose-400' 
              : 'bg-stone-900/40 text-stone-200 hover:bg-stone-900/70 hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 flex gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-1.5 sm:py-2.5 bg-stone-900/90 hover:bg-stone-900 text-stone-100 dark:bg-stone-100/90 dark:text-stone-950 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase flex items-center justify-center gap-1 backdrop-blur-sm transition"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Quick View</span>
            <span className="sm:hidden">View</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={!product.inStock}
            className="p-1.5 sm:p-2.5 bg-amber-400/95 hover:bg-amber-400 text-stone-950 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase flex items-center justify-center backdrop-blur-sm transition disabled:opacity-50"
            title="Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">
            <span className="truncate max-w-[70%]">{product.category}</span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span className="font-mono text-[9px] sm:text-[10px] text-stone-700 dark:text-stone-300">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-xs sm:text-base md:text-lg text-stone-900 dark:text-stone-100 hover:text-amber-800 dark:hover:text-amber-400 cursor-pointer line-clamp-1 transition font-normal tracking-wide"
          >
            {product.title}
          </h3>

          <p className="hidden sm:block text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-1 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Footer: Price & Color Dots */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-base font-semibold text-stone-900 dark:text-stone-100 font-mono">
              {formatPrice(product.price, currency)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through font-mono">
                {formatPrice(product.compareAtPrice, currency)}
              </span>
            )}
          </div>

          {/* Color previews */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 2).map((col, idx) => (
                <span
                  key={`${col.name}-${idx}`}
                  title={col.name}
                  style={{ backgroundColor: col.hex }}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-stone-300 dark:border-stone-600"
                />
              ))}
              {product.colors.length > 2 && (
                <span className="text-[8px] sm:text-[9px] text-stone-400">+{product.colors.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
