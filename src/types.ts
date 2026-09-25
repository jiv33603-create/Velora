export type ProductCategory = 
  | 'All'
  | 'Haute Couture'
  | 'Fine Leather'
  | 'High Jewelry'
  | 'Artisan Footwear'
  | 'Signature Fragrance'
  | 'Home & Living';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  badge?: string;
  description: string;
  details: string[];
  materials: string;
  care: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
}

export interface CartItem {
  id: string; // unique item cart key: `${productId}-${selectedSize}-${selectedColor}`
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
}

export type PaymentMethodType = 'COD' | 'ONLINE';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  street: string;
  suite?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode?: string;
}

export type OrderStatus = 'confirmed' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerInfo;
  deliveryAddress: DeliveryAddress;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
  paymentMethod: PaymentMethodType;
  paymentDetails: {
    method: string;
    status: string;
    last4?: string;
    transactionId?: string;
  };
  shippingMethod: ShippingMethod;
  summary: OrderSummary;
  notes?: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface FilterState {
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  search: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  inStockOnly: boolean;
}

export interface TelegramConfig {
  botToken?: string;
  chatId?: string;
}

export interface IntegrationSettings {
  telegramBotToken: string;
  telegramChatId: string;
  appsScriptUrl: string;
  googleSheetCsvUrl: string;
}

export interface UnitTestResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  message?: string;
}
