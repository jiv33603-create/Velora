import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, RefreshCw, X, ArrowUpDown, Database, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { Product, ProductCategory, CurrencyCode, FilterState } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  currency: CurrencyCode;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isLoading?: boolean;
  googleSheetUrl?: string;
  onConnectSheet?: (url: string) => void;
  sheetSyncStatus?: { syncing: boolean; success?: boolean; message?: string };
  isSheetModalOpen?: boolean;
  setIsSheetModalOpen?: (open: boolean) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currency,
  selectedCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  searchQuery,
  onSearchChange,
  isLoading = false,
  googleSheetUrl = '',
  onConnectSheet,
  sheetSyncStatus,
  isSheetModalOpen: externalIsModalOpen,
  setIsSheetModalOpen: externalSetIsModalOpen
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [tempSheetUrl, setTempSheetUrl] = useState(googleSheetUrl);
  const [inlineSheetUrl, setInlineSheetUrl] = useState(googleSheetUrl);
  const [showSheetGuide, setShowSheetGuide] = useState(false);

  const isModalOpen = externalIsModalOpen !== undefined ? externalIsModalOpen : internalModalOpen;
  const setIsModalOpen = externalSetIsModalOpen || setInternalModalOpen;

  const categories: ProductCategory[] = [
    'All',
    'Haute Couture',
    'Fine Leather',
    'High Jewelry',
    'Artisan Footwear',
    'Signature Fragrance',
    'Home & Living'
  ];

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.subtitle || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.materials || '').toLowerCase().includes(q) ||
          (p.sku || '').toLowerCase().includes(q)
      );
    }

    // Stock availability filter
    if (inStockOnly) {
      list = list.filter((p) => p.inStock && (p.stockCount ?? 1) > 0);
    }

    // Sort order
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    onSelectCategory('All');
    onSearchChange('');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const handleSaveSheetUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConnectSheet && tempSheetUrl.trim()) {
      onConnectSheet(tempSheetUrl.trim());
      setIsModalOpen(false);
    }
  };

  const handleInlineSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConnectSheet && inlineSheetUrl.trim()) {
      onConnectSheet(inlineSheetUrl.trim());
    }
  };

  return (
    <section id="catalog-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      
      {/* 🌟 PROMINENT GOOGLE SHEETS LIVE SYNC BAR (Always Visible at Top of Catalog) */}
      <div className="mb-8 p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 border border-emerald-500/50 rounded-sm text-stone-100 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg font-medium text-stone-100">
                  Google Sheets Live Catalog Sync
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  sheetSyncStatus?.success 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    : googleSheetUrl
                    ? 'bg-amber-950 text-amber-300 border border-amber-600'
                    : 'bg-stone-800 text-stone-300 border border-stone-700'
                }`}>
                  {sheetSyncStatus?.syncing ? 'Syncing...' : sheetSyncStatus?.success ? 'Live Synced' : googleSheetUrl ? 'Connected' : 'Paste Link'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                Paste your Google Sheet link here to load and display your products directly in the store.
              </p>
            </div>
          </div>

          {/* Quick Paste & Sync Form */}
          <form onSubmit={handleInlineSyncSubmit} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:min-w-[460px]">
            <input
              type="text"
              value={inlineSheetUrl}
              onChange={(e) => setInlineSheetUrl(e.target.value)}
              placeholder="Paste Google Sheet URL (https://docs.google.com/spreadsheets/d/...)"
              className="flex-1 px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-sm text-stone-100 font-mono placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={sheetSyncStatus?.syncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-sm transition flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 shadow-md"
            >
              {sheetSyncStatus?.syncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sync Products</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sync Feedback Message */}
        {sheetSyncStatus?.message && (
          <div className={`mt-3 pt-2 border-t border-stone-800 text-xs flex items-center justify-between ${
            sheetSyncStatus.success ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            <span className="flex items-center gap-1.5">
              {sheetSyncStatus.success ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {sheetSyncStatus.message}
            </span>
            <button
              type="button"
              onClick={() => setShowSheetGuide(!showSheetGuide)}
              className="text-[11px] underline font-medium text-stone-400 hover:text-white"
            >
              {showSheetGuide ? 'Hide Instructions' : 'Why are my products not showing?'}
            </button>
          </div>
        )}

        {/* Collapsible Quick Guide */}
        {(!sheetSyncStatus?.message || showSheetGuide) && (
          <div className="mt-3 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
            <button
              type="button"
              onClick={() => setShowSheetGuide(!showSheetGuide)}
              className="font-semibold text-stone-300 hover:text-emerald-400 flex items-center gap-1"
            >
              <span>{showSheetGuide ? '▼ Hide Quick Setup Guide' : '▶ How to connect your Google Sheet (Click to view)'}</span>
            </button>

            {showSheetGuide && (
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-950/70 p-3 rounded border border-stone-800">
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">Step 1: Set Access</span>
                  <p>In your Google Sheet, click <strong>Share</strong> (top right) &rarr; change General Access to <strong>&quot;Anyone with the link can view&quot;</strong>.</p>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">Step 2: Column Headers</span>
                  <p>Row 1 must have at least <strong>Title</strong> (or Name) and <strong>Price</strong>. Optional: Category, Image, Stock.</p>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">Step 3: Paste & Sync</span>
                  <p>Copy the URL from your browser address bar, paste it in the box above, and click <strong>Sync Products</strong>!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 dark:border-stone-800 pb-6 sm:pb-8 mb-6 sm:mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 font-semibold">
              Catalogue Permanent
            </span>

            {/* Google Sheets Connection Pill & Sync Trigger */}
            <button
              onClick={() => {
                setTempSheetUrl(googleSheetUrl);
                setIsModalOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider transition ${
                sheetSyncStatus?.syncing
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
                  : sheetSyncStatus?.success
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                  : googleSheetUrl
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
                  : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-400 font-medium'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>
                {sheetSyncStatus?.syncing
                  ? 'Syncing Sheet...'
                  : sheetSyncStatus?.success
                  ? 'Google Sheet Live'
                  : googleSheetUrl
                  ? 'Google Sheet Connected'
                  : 'Link Google Sheet'}
              </span>
            </button>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal tracking-wide">
            The Haute Collection
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 sm:mt-2 font-mono">
            Showing {filteredProducts.length} curated {filteredProducts.length === 1 ? 'creation' : 'creations'} (2 per row on mobile, 4 on desktop)
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick inline search input */}
          <div className="relative flex-1 sm:flex-initial min-w-[160px] sm:min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search creations..."
              className="w-full pl-8 pr-7 py-1.5 sm:py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-sm text-xs text-stone-700 dark:text-stone-300">
            <ArrowUpDown className="w-3 h-3 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer text-[11px] sm:text-xs"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-sm border flex items-center gap-1.5 transition ${
              inStockOnly
                ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800 font-medium'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${inStockOnly ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            <span className="hidden sm:inline">In Stock Only</span>
            <span className="sm:hidden">In Stock</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner if error or notice */}
      {sheetSyncStatus?.message && !sheetSyncStatus.success && (
        <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-sm text-xs text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">Google Sheets Notice:</p>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">{sheetSyncStatus.message}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-semibold underline shrink-0 hover:text-amber-700"
          >
            Fix Sheet URL / Permissions
          </button>
        </div>
      )}

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 sm:pb-4 mb-6 sm:mb-8 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap transition-all rounded-sm ${
                isActive
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-semibold shadow-md'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton State: 2 cols on mobile, 4 cols on desktop */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="animate-pulse flex flex-col bg-stone-100 dark:bg-stone-900 rounded-sm overflow-hidden">
              <div className="aspect-[3/4] bg-stone-200 dark:bg-stone-800" />
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-3 w-1/3 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-4 w-3/4 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-3 w-1/4 bg-stone-200 dark:bg-stone-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        /* Product Grid: 2 columns on phone/mobile, 4 columns on desktop */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.has(product.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-sm p-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
            No matching pieces found
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-md mx-auto mt-1.5">
            We could not find any creations matching your search criteria. Try modifying your filters or browse our full catalogue.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm hover:opacity-90 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}

      {/* Google Sheet Direct Connect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm shadow-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                Google Sheets Live Catalog Sync
              </h3>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Paste your Google Sheet URL below. You can paste any standard Google Sheet link (e.g. <code>https://docs.google.com/spreadsheets/d/.../edit</code>) and VELORA will automatically convert and sync your products!
            </p>

            <form onSubmit={handleSaveSheetUrl} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Google Sheet URL
                </label>
                <input
                  type="text"
                  required
                  value={tempSheetUrl}
                  onChange={(e) => setTempSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit..."
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Step-by-step instructions for why products might not show */}
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 rounded-sm space-y-2 text-[11px] text-stone-600 dark:text-stone-400">
                <div className="font-semibold text-stone-800 dark:text-stone-200">
                  Why might Google Sheets products not show?
                </div>
                <ul className="list-decimal pl-4 space-y-1">
                  <li>
                    <strong>Sheet Access:</strong> By default, Google Sheets is private to your account. Open your sheet &rarr; click <strong>Share</strong> (top-right) &rarr; change General Access to <strong>Anyone with the link can view</strong> (Viewer).
                  </li>
                  <li>
                    <strong>Publish Option:</strong> Alternatively, go to <strong>File &rarr; Share &rarr; Publish to web</strong> &rarr; select <strong>Comma-separated values (.csv)</strong> and click Publish.
                  </li>
                  <li>
                    <strong>Column Headers:</strong> Row 1 in your sheet must contain at least <strong>Title</strong> (or <em>Name</em>) and <strong>Price</strong>. Optional headers: <em>Category</em>, <em>Subtitle</em>, <em>Image</em>, <em>Stock</em>, <em>Description</em>.
                  </li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sheetSyncStatus?.syncing}
                  className="px-6 py-2 bg-stone-900 text-stone-100 dark:bg-amber-400 dark:text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm hover:opacity-90 transition flex items-center gap-1.5"
                >
                  {sheetSyncStatus?.syncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      <span>Connect & Sync Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
