/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { ProductGrid } from './components/ProductGrid';
import { TrustBadges } from './components/TrustBadges';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { LookbookModal } from './components/LookbookModal';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { ContactModal } from './components/ContactModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OfflineBanner } from './components/OfflineBanner';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { 
  Product, 
  CartItem, 
  ProductCategory, 
  CurrencyCode, 
  Order, 
  IntegrationSettings, 
  ProductColor 
} from './types';
import { validatePromoCode, getFallbackImage } from './utils/formatters';
import { fetchGoogleSheetCatalog, normalizeGoogleSheetUrl } from './services/apiService';

// Seed initial historical luxury orders
const INITIAL_ORDERS: Order[] = [
  {
    orderId: 'VEL-2026-48192',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'shipped',
    customer: {
      name: 'Princess Seraphina of Monaco',
      email: 'seraphina@palais-grimaldi.mc',
      phone: '+377 98 98 80 00'
    },
    deliveryAddress: {
      street: 'Place du Palais',
      suite: 'Aile Ouest',
      city: 'Monaco-Ville',
      state: 'Monaco',
      postalCode: '98015',
      country: 'France'
    },
    items: [
      {
        productId: 'prod-01',
        title: 'Aura Silk-Organza Trench Coat',
        price: 1850,
        quantity: 1,
        size: 'S',
        color: 'Noir Ébène',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    paymentMethod: 'ONLINE',
    paymentDetails: {
      method: 'Verified Centurion Black Card',
      status: 'settled',
      last4: '0008',
      transactionId: 'TXN-MC-90812'
    },
    shippingMethod: {
      id: 'express',
      name: 'Priority Atelier Air Courier',
      price: 45,
      estimatedDays: '1-2 business days',
      description: 'Dedicated flight dispatch directly from Paris'
    },
    summary: {
      subtotal: 1850,
      discount: 185,
      shipping: 45,
      tax: 133,
      total: 1843,
      promoCode: 'VELORA10'
    }
  },
  {
    orderId: 'VEL-2026-39105',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'delivered',
    customer: {
      name: 'Julian Montgomery-Sterling',
      email: 'j.sterling@mayfair-advisory.co.uk',
      phone: '+44 20 7946 0912'
    },
    deliveryAddress: {
      street: '14 Berkeley Square',
      city: 'London',
      state: 'England',
      postalCode: 'W1J 5AW',
      country: 'United Kingdom'
    },
    items: [
      {
        productId: 'prod-02',
        title: 'The Palais Structured Calfskin Tote',
        price: 2400,
        quantity: 1,
        size: 'Medium',
        color: 'Cognac Saddle',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    paymentMethod: 'COD',
    paymentDetails: {
      method: 'Cash on Delivery (Courier Escort)',
      status: 'settled',
      transactionId: 'COD-GB-7712'
    },
    shippingMethod: {
      id: 'standard',
      name: 'Complimentary White-Glove Atelier Delivery',
      price: 0,
      estimatedDays: '3-5 business days',
      description: 'Bespoke insured courier'
    },
    summary: {
      subtotal: 2400,
      discount: 0,
      shipping: 0,
      tax: 192,
      total: 2592
    }
  }
];

export default function App() {
  // Products catalog state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('velora_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
          return parsed.map((p, idx) => ({
            ...p,
            id: p.id || `prod-${idx}`,
            sku: p.sku || `VEL-${idx}`,
            title: p.title || 'Untitled Creation',
            slug: p.slug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${idx}`),
            subtitle: p.subtitle || '',
            category: p.category || 'Haute Couture',
            price: typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 250),
            compareAtPrice: typeof p.compareAtPrice === 'number' ? p.compareAtPrice : undefined,
            rating: typeof p.rating === 'number' ? p.rating : 4.9,
            reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : 12,
            inStock: p.inStock !== false,
            stockCount: typeof p.stockCount === 'number' ? p.stockCount : 10,
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [getFallbackImage(p.title || 'Product')],
            description: p.description || 'Exquisite luxury craftsmanship.',
            materials: p.materials || 'Artisanal Pure Fabrics & Finishes',
            care: p.care || 'Specialist care recommended.',
            colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Classic Noir', hex: '#111111' }],
            sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['Standard'],
            badge: p.badge || undefined,
            isNew: Boolean(p.isNew),
            isBestseller: Boolean(p.isBestseller)
          }));
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('velora_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.id && item.product && item.product.title && typeof item.product.price === 'number');
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('velora_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
      return new Set(['prod-01', 'prod-03']);
    } catch {
      return new Set(['prod-01', 'prod-03']);
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('velora_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Integration settings state
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>(() => {
    try {
      const saved = localStorage.getItem('velora_integrations');
      return saved ? JSON.parse(saved) : {
        telegramBotToken: '',
        telegramChatId: '',
        appsScriptUrl: '',
        googleSheetCsvUrl: ''
      };
    } catch {
      return {
        telegramBotToken: '',
        telegramChatId: '',
        appsScriptUrl: '',
        googleSheetCsvUrl: ''
      };
    }
  });

  // UI Navigation & View states
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('velora_currency');
      if (saved && ['INR', 'USD', 'EUR', 'GBP'].includes(saved)) {
        return saved as CurrencyCode;
      }
    } catch {}
    return 'INR';
  });

  const handleCurrencyChange = (newCurr: CurrencyCode) => {
    setCurrency(newCurr);
    try {
      localStorage.setItem('velora_currency', newCurr);
    } catch {}
  };
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('velora_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Promo code in cart
  const [promoCode, setPromoCode] = useState('VELORA10');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(10);

  // Modals & Drawers visibility
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  // Google Sheets Live Sync State
  const [sheetSyncStatus, setSheetSyncStatus] = useState<{ syncing: boolean; success?: boolean; message?: string }>({
    syncing: false
  });

  const handleConnectGoogleSheet = async (url: string) => {
    if (!url || !url.trim()) return;
    setSheetSyncStatus({ syncing: true, message: 'Connecting to Google Sheets...' });
    
    const result = await fetchGoogleSheetCatalog(url.trim());
    if (result.success && result.products && result.products.length > 0) {
      setProducts(result.products);
      setIntegrationSettings((prev) => ({ ...prev, googleSheetCsvUrl: url.trim() }));
      setSheetSyncStatus({
        syncing: false,
        success: true,
        message: `Successfully loaded ${result.products.length} creations from your Google Sheet!`
      });
      try {
        localStorage.setItem('velora_products', JSON.stringify(result.products));
      } catch {}
    } else {
      setSheetSyncStatus({
        syncing: false,
        success: false,
        message: result.error || 'Failed to parse Google Sheet. Verify sharing settings.'
      });
    }
  };

  // Auto-sync Google Sheets on mount if URL exists
  useEffect(() => {
    if (integrationSettings.googleSheetCsvUrl) {
      handleConnectGoogleSheet(integrationSettings.googleSheetCsvUrl);
    }
  }, []);

  // Sync dark mode class on HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('velora_dark_mode', JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('velora_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('velora_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch {}
  }, [wishlistIds]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('velora_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Persist integration settings
  useEffect(() => {
    try {
      localStorage.setItem('velora_integrations', JSON.stringify(integrationSettings));
    } catch {}
  }, [integrationSettings]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: ProductColor,
    quantity: number = 1
  ) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'Standard';
    const color = selectedColor || (product.colors && product.colors[0]) || { name: 'Noir', hex: '#111' };
    const cartItemId = `${product.id}-${size}-${color.name}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            quantity,
            selectedSize: size,
            selectedColor: color
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleInstantCheckout = (
    product: Product,
    selectedSize?: string,
    selectedColor?: ProductColor,
    quantity: number = 1
  ) => {
    handleAddToCart(product, selectedSize, selectedColor, quantity);
    setActiveQuickViewProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Promo code operations
  const handleApplyPromoCode = (code: string) => {
    const res = validatePromoCode(code);
    if (res.valid) {
      setPromoCode(code.toUpperCase());
      setPromoDiscountPercent(res.discountPercent);
      return { valid: true, message: `Privé Privilege applied: ${res.description}` };
    }
    return { valid: false, message: 'Invalid or expired promotional code.' };
  };

  const handleRemovePromoCode = () => {
    setPromoCode('');
    setPromoDiscountPercent(0);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  };

  // Order completed
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart upon successful order
  };

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-200">
      
      {/* Offline Mode Banner */}
      <OfflineBanner />

      {/* Main Navigation Bar */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.size}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        currency={currency}
        onChangeCurrency={handleCurrencyChange}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAdmin={() => setIsAdminOpen(!isAdminOpen)}
        isAdminOpen={isAdminOpen}
        onOpenSheetSync={() => setIsSheetModalOpen(true)}
        isSheetConnected={Boolean(integrationSettings.googleSheetCsvUrl && sheetSyncStatus.success)}
      />

      <main className="flex-1">
        {/* Editorial Hero Banner */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onLookbookClick={() => setIsLookbookOpen(true)}
        />

        {/* Curated Categories Metiers */}
        <FeaturedCategories
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          activeCategory={selectedCategory}
        />

        {/* Product Catalog Grid */}
        <ProductGrid
          products={products}
          currency={currency}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onQuickView={(p) => setActiveQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          googleSheetUrl={integrationSettings.googleSheetCsvUrl}
          onConnectSheet={handleConnectGoogleSheet}
          sheetSyncStatus={sheetSyncStatus}
          isSheetModalOpen={isSheetModalOpen}
          setIsSheetModalOpen={setIsSheetModalOpen}
        />

        {/* Maison Heritage & Trust Badges */}
        <TrustBadges />

        {/* VIP Newsletter Privé */}
        <NewsletterSection />
      </main>

      {/* Professional Footer */}
      <Footer
        onOpenPolicy={(type) => setActivePolicy(type)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Product Quick-View / Details Modal */}
      {activeQuickViewProduct && (
        <ProductDetailModal
          key={activeQuickViewProduct.id}
          product={activeQuickViewProduct}
          onClose={() => setActiveQuickViewProduct(null)}
          currency={currency}
          onAddToCart={handleAddToCart}
          onInstantCheckout={handleInstantCheckout}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlistIds.has(activeQuickViewProduct.id)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        promoCode={promoCode}
        promoDiscountPercent={promoDiscountPercent}
        onApplyPromoCode={handleApplyPromoCode}
        onRemovePromoCode={handleRemovePromoCode}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currency={currency}
        onMoveToBag={(p) => {
          handleAddToCart(p);
          handleToggleWishlist(p);
        }}
        onRemoveFromWishlist={handleToggleWishlist}
      />

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={currency}
        onSelectProduct={(p) => setActiveQuickViewProduct(p)}
      />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        promoCode={promoCode}
        promoDiscountPercent={promoDiscountPercent}
        onOrderCompleted={handleOrderCompleted}
        integrationSettings={integrationSettings}
      />

      {/* Editorial Lookbook Modal */}
      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Governance & Policies Modal */}
      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Client Concierge / Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Administrator & Analytics Command Suite */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={(orderId, status) => {
          setOrders((prev) =>
            prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
          );
        }}
        products={products}
        onSyncProducts={(newProducts) => {
          setProducts(newProducts);
          try {
            localStorage.setItem('velora_products', JSON.stringify(newProducts));
          } catch {}
        }}
        integrationSettings={integrationSettings}
        onUpdateIntegrationSettings={(newSettings) => {
          setIntegrationSettings(newSettings);
        }}
      />

    </div>
  );
}
