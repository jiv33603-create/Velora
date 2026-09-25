import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice, getFallbackImage } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.materials.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex flex-col items-center pt-16 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search haute couture, emeralds, calfskin..."
            className="flex-1 bg-transparent text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 ml-2"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-stone-100 dark:divide-stone-800/80">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-stone-500">
              <span className="block mb-2 uppercase tracking-widest text-[10px] text-stone-400">Popular Searches:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {['Silk Trench', 'Emerald Collar', 'Calfskin Tote', 'Extrait de Parfum', 'Cashmere Cape'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-sm text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="py-3 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 px-2 rounded-sm cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0] || getFallbackImage(product.title)}
                    alt={product.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackImage(product.title);
                    }}
                    className="w-12 h-14 object-cover rounded-sm bg-stone-100 dark:bg-stone-950"
                  />
                  <div>
                    <h4 className="font-serif text-sm text-stone-900 dark:text-stone-100 font-medium">
                      {product.title}
                    </h4>
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider font-mono">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {formatPrice(product.price, currency)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-stone-500">
              No creations matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
