import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Product, CurrencyCode, ProductColor } from '../types';
import { formatPrice, getFallbackImage } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: CurrencyCode;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  onInstantCheckout: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  onAddToCart,
  onInstantCheckout,
  onToggleWishlist,
  isWishlisted
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    (product.colors && product.colors[0]) || { name: 'Noir', hex: '#111111' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    (product.sizes && product.sizes[0]) || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping'>('details');

  const images = (product.images && product.images.length > 0) ? product.images : [getFallbackImage(product.title)];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          
          {/* Left: Gallery & Carousel */}
          <div className="relative bg-stone-100 dark:bg-stone-950 flex flex-col justify-between p-4 sm:p-6">
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-stone-200 dark:bg-stone-900">
              <img
                src={images[activeImageIndex]}
                alt={product.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFallbackImage(product.title);
                }}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />

              {/* Badges */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-stone-900/90 text-stone-100 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 backdrop-blur-sm rounded-sm">
                  {product.badge}
                </span>
              )}

              {/* Prev / Next controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/50 hover:bg-stone-900/80 text-white backdrop-blur-sm transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/50 hover:bg-stone-900/80 text-white backdrop-blur-sm transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-sm overflow-hidden border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-stone-900 dark:border-amber-400 opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Buying Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-mono">
                <span>{product.category}</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal tracking-wide mt-2">
                {product.title}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-light mt-1">
                {product.subtitle}
              </p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-stone-400 line-through font-mono">
                      {formatPrice(product.compareAtPrice, currency)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono font-medium">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-2">
                    <span>Maison Color</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition ${
                          selectedColor.name === c.name
                            ? 'border-stone-900 dark:border-stone-100 scale-110 shadow-sm'
                            : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: c.hex }}
                          className="w-5 h-5 rounded-full border border-stone-300 dark:border-stone-700"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-2">
                    <span>Select Proportion / Size</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 text-xs font-mono rounded-sm border transition ${
                          selectedSize === s
                            ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950 font-semibold'
                            : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Stock status */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-mono font-medium text-stone-900 dark:text-stone-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="px-3 py-1.5 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {product.stockCount > 0 ? (
                    <span>In stock ({product.stockCount} remaining)</span>
                  ) : (
                    <span className="text-rose-500">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
                    disabled={!product.inStock}
                    className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 rounded-sm transition disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    aria-label="Wishlist"
                    className={`p-3.5 rounded-sm border transition ${
                      isWishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => onInstantCheckout(product, selectedSize, selectedColor, quantity)}
                  disabled={!product.inStock}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 rounded-sm transition shadow-lg shadow-amber-950/10 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Instant 1-Click Checkout
                </button>
              </div>

              {/* Tabbed Info Accordion */}
              <div className="mt-8 border-t border-stone-200 dark:border-stone-800 pt-4">
                <div className="flex border-b border-stone-200 dark:border-stone-800 text-xs">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 mr-6 uppercase tracking-wider font-medium transition border-b-2 -mb-[1px] ${
                      activeTab === 'details'
                        ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`pb-2 mr-6 uppercase tracking-wider font-medium transition border-b-2 -mb-[1px] ${
                      activeTab === 'materials'
                        ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Provenance & Care
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 uppercase tracking-wider font-medium transition border-b-2 -mb-[1px] ${
                      activeTab === 'shipping'
                        ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Delivery
                  </button>
                </div>

                <div className="py-4 text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  {activeTab === 'details' && (
                    <div>
                      <p className="mb-3">{product.description}</p>
                      <ul className="list-disc pl-4 space-y-1 text-stone-700 dark:text-stone-300">
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="space-y-2">
                      <div>
                        <strong className="font-semibold text-stone-800 dark:text-stone-200">Composition:</strong>{' '}
                        {product.materials}
                      </div>
                      <div>
                        <strong className="font-semibold text-stone-800 dark:text-stone-200">Atelier Care:</strong>{' '}
                        {product.care}
                      </div>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                        <Truck className="w-4 h-4 text-amber-600" />
                        <span>Complimentary white-glove express delivery on orders over {formatPrice(250, currency)}.</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                        <RotateCcw className="w-4 h-4 text-amber-600" />
                        <span>30-day bespoke return or exchange service with prepaid pickup.</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Includes certificate of authenticity & archival presentation packaging.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
