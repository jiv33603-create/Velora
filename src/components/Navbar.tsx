import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  Sliders, 
  ChevronRight, 
  Globe,
  Database,
  RefreshCw
} from 'lucide-react';
import { CurrencyCode, ProductCategory } from '../types';
import { formatPrice } from '../utils/formatters';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  onOpenSheetSync: () => void;
  isSheetConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  darkMode,
  onToggleDarkMode,
  currency,
  onChangeCurrency,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onSelectCategory,
  onOpenAdmin,
  isAdminOpen,
  onOpenSheetSync,
  isSheetConnected = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { label: string; cat: ProductCategory }[] = [
    { label: 'Haute Couture', cat: 'Haute Couture' },
    { label: 'Fine Leather', cat: 'Fine Leather' },
    { label: 'High Jewelry', cat: 'High Jewelry' },
    { label: 'Artisan Footwear', cat: 'Artisan Footwear' },
    { label: 'Fragrance', cat: 'Signature Fragrance' },
    { label: 'Home & Living', cat: 'Home & Living' },
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    const element = document.getElementById('catalog-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-50/90 dark:bg-stone-950/90 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 dark:bg-stone-900 dark:text-stone-300 text-[11px] font-medium tracking-widest py-2 px-3 sm:px-4 text-center flex items-center justify-between border-b border-stone-800">
        <div className="hidden lg:flex items-center space-x-3 text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ATELIER PARIS • NEW YORK • TOKYO
          </span>
        </div>

        {/* Center Banner */}
        <div className="mx-auto flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
          <span>COMPLIMENTARY WORLDWIDE DELIVERY OVER {formatPrice(250, currency)}</span>
          <span className="hidden sm:inline text-amber-400">•</span>
          <span className="hidden sm:inline text-stone-300">CODE: <strong className="text-amber-300 tracking-wider">VELORA10</strong> FOR 10% OFF</span>
        </div>

        {/* Direct Google Sheets and Admin triggers */}
        <div className="flex items-center space-x-2">
          {/* Direct Google Sheet Button in top bar */}
          <button
            onClick={onOpenSheetSync}
            className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
              isSheetConnected
                ? 'bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border border-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm animate-pulse'
            }`}
            title="Link Google Sheet products"
          >
            <Database className="w-3 h-3" />
            <span>{isSheetConnected ? 'Google Sheet Active' : 'Link Google Sheet'}</span>
          </button>

          <button 
            onClick={onOpenAdmin}
            className={`hidden sm:inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 rounded transition ${
              isAdminOpen 
                ? 'bg-amber-500 text-stone-950 font-bold' 
                : 'text-stone-400 hover:text-amber-300 bg-stone-800/80 hover:bg-stone-800'
            }`}
          >
            {isAdminOpen ? 'Close Admin' : 'Admin'}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button
              onClick={() => handleCategoryClick('All')}
              className="text-xs uppercase tracking-[0.2em] font-medium text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition"
            >
              All Pieces
            </button>
            {categories.slice(0, 4).map((item) => (
              <button
                key={item.cat}
                onClick={() => handleCategoryClick(item.cat)}
                className="text-xs uppercase tracking-[0.2em] font-medium text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                const element = document.getElementById('lookbook-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs uppercase tracking-[0.2em] font-medium text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition"
            >
              Lookbook
            </button>
          </nav>

          {/* Brand Logo */}
          <div className="text-center cursor-pointer select-none" onClick={() => handleCategoryClick('All')}>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-normal text-stone-950 dark:text-stone-50">
              VELORA
            </h1>
            <p className="text-[9px] tracking-[0.45em] text-stone-500 dark:text-stone-400 -mt-0.5 uppercase">
              Maison de Luxe
            </p>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Desktop Google Sheet quick sync button */}
            <button
              onClick={onOpenSheetSync}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-emerald-600/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition"
              title="Google Sheet Live Sync"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] font-semibold">Google Sheets</span>
            </button>

            {/* Currency Switcher */}
            <div className="hidden sm:flex items-center text-xs font-medium text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 rounded-full px-2.5 py-1">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
              {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeCurrency(c)}
                  className={`px-1.5 py-0.5 rounded text-[11px] transition ${
                    currency === c 
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-semibold' 
                      : 'hover:text-stone-950 dark:hover:text-white'
                  }`}
                >
                  {c === 'INR' ? '₹ INR' : c}
                </button>
              ))}
            </div>

            {/* Search Icon (Desktop) */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex p-2 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition"
              aria-label="Open search dialog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition"
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-700" />}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-950 dark:text-white hover:text-amber-800 dark:hover:text-amber-400 transition flex items-center gap-1.5"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-stone-900 text-stone-50 dark:bg-amber-500 dark:text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-4">
            
            {/* Mobile Google Sheet Connect Button */}
            <button
              onClick={() => {
                onOpenSheetSync();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <Database className="w-4 h-4" />
              <span>Link & Sync Google Sheet Products</span>
            </button>

            <button
              onClick={() => handleCategoryClick('All')}
              className="text-left font-serif text-lg text-stone-900 dark:text-stone-100 py-1 border-b border-stone-100 dark:border-stone-900 flex justify-between items-center"
            >
              <span>Explore All Collections</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {categories.map((item) => (
              <button
                key={item.cat}
                onClick={() => handleCategoryClick(item.cat)}
                className="text-left text-sm uppercase tracking-wider text-stone-600 dark:text-stone-300 py-1 flex justify-between items-center"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-500">Currency</span>
              <div className="flex space-x-1">
                {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => onChangeCurrency(c)}
                    className={`px-2 py-1 text-xs rounded ${
                      currency === c 
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold' 
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {c === 'INR' ? '₹ INR' : c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs uppercase tracking-widest font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 rounded"
              >
                {isAdminOpen ? 'Close Admin Dashboard' : 'Open Admin & Analytics'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

