import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice, validatePromoCode, getFallbackImage } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  promoCode: string;
  promoDiscountPercent: number;
  onApplyPromoCode: (code: string) => { valid: boolean; message: string };
  onRemovePromoCode: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  promoDiscountPercent,
  onApplyPromoCode,
  onRemovePromoCode
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const discountAmount = Math.round(subtotal * (promoDiscountPercent / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  const freeShippingThreshold = 250;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotalAfterDiscount);
  const progressPercent = Math.min(100, Math.round((subtotalAfterDiscount / freeShippingThreshold) * 100));

  const shippingFee = subtotalAfterDiscount >= freeShippingThreshold || items.length === 0 ? 0 : 25;
  const estimatedTax = Math.round(subtotalAfterDiscount * 0.08);
  const grandTotal = subtotalAfterDiscount + shippingFee + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const result = onApplyPromoCode(promoInput.trim());
    if (result.valid) {
      setPromoMessage({ text: result.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: result.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <h2 className="font-serif text-xl font-normal text-stone-900 dark:text-stone-100">
                Your Selection
              </h2>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="px-6 py-3.5 bg-stone-100 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  {remainingForFreeShipping > 0 ? (
                    <>Add <strong className="text-amber-700 dark:text-amber-400 font-mono">{formatPrice(remainingForFreeShipping, currency)}</strong> more for complimentary delivery</>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Complimentary White-Glove Shipping Unlocked
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] text-stone-500">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 dark:bg-amber-400 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                  Your bag is empty
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs max-w-xs mt-1">
                  Discover our timeless creations designed for enduring elegance.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-3 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm hover:opacity-90 transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 rounded-sm"
                >
                  {/* Thumbnail */}
                  <img
                    src={(item.product?.images && item.product.images[0]) || getFallbackImage(item.product?.title || 'Creation')}
                    alt={item.product?.title || 'Creation'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackImage(item.product?.title || 'Creation');
                    }}
                    className="w-20 h-24 object-cover rounded-sm bg-stone-100 dark:bg-stone-950"
                  />

                  {/* Item info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                          {item.product?.title || 'Artisanal Creation'}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-500 transition p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        <span className="flex items-center gap-1">
                          <span
                            style={{ backgroundColor: item.selectedColor.hex }}
                            className="w-2 h-2 rounded-full border border-stone-400"
                          />
                          {item.selectedColor.name}
                        </span>
                        <span>•</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-sm text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono font-medium text-stone-900 dark:text-stone-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 space-y-4">
              
              {/* Promo Code Form */}
              <div>
                {promoDiscountPercent > 0 ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-sm text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-semibold">{promoCode}</span>
                      <span>(-{promoDiscountPercent}%)</span>
                    </div>
                    <button
                      onClick={onRemovePromoCode}
                      className="text-stone-500 hover:text-stone-900 dark:hover:text-white text-xs underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. VELORA10)"
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm uppercase tracking-wider focus:outline-none focus:border-stone-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-950 text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <p className={`text-[11px] mt-1.5 ${promoMessage.isError ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Order Calculations Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 font-light border-t border-stone-100 dark:border-stone-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-stone-900 dark:text-stone-100">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-700 dark:text-amber-400 font-medium">
                    <span>Privé Privilege ({promoDiscountPercent}%)</span>
                    <span className="font-mono">-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-mono font-medium text-stone-900 dark:text-stone-100">
                    {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Atelier Tax (8%)</span>
                  <span className="font-mono font-medium text-stone-900 dark:text-stone-100">
                    {formatPrice(estimatedTax, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Estimated Total</span>
                  <span className="font-mono">{formatPrice(grandTotal, currency)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-semibold text-xs uppercase tracking-[0.25em] rounded-sm transition flex items-center justify-center gap-2 shadow-xl shadow-stone-950/10"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 tracking-wider uppercase text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>256-Bit Encrypted Security • COD & Instant Online Payments</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
