import { CurrencyCode } from '../types';

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  INR: { symbol: '₹', rate: 86.5, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' }
};

export function formatPrice(amountInUSD: number, currency: CurrencyCode = 'INR'): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
  const converted = amountInUSD * config.rate;
  const formatted = Math.round(converted).toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US');
  return `${config.symbol}${formatted}`;
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `VEL-${year}-${randomNum}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return isoString;
  }
}

export const VALID_PROMO_CODES: Record<string, { percent: number; description: string }> = {
  'VELORA10': { percent: 10, description: '10% Privé Atelier Discount' },
  'LUXE20': { percent: 20, description: '20% Maison VIP Invitation' },
  'WELCOME15': { percent: 15, description: '15% New Collector Welcome' }
};

export function validatePromoCode(code: string): { valid: boolean; discountPercent: number; description: string } {
  const normalized = code.trim().toUpperCase();
  if (VALID_PROMO_CODES[normalized]) {
    return {
      valid: true,
      discountPercent: VALID_PROMO_CODES[normalized].percent,
      description: VALID_PROMO_CODES[normalized].description
    };
  }
  return { valid: false, discountPercent: 0, description: 'Invalid promotional code' };
}

// Fallback image generator (creates an elegant luxury placeholder SVG)
export function getFallbackImage(title: string = 'VELORA'): string {
  const encodedTitle = encodeURIComponent(title.slice(0, 20));
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="%231E1C1A"/><rect x="20" y="20" width="560" height="760" fill="none" stroke="%233D3833" stroke-width="1"/><text x="50%" y="46%" font-family="Georgia, serif" font-size="42" fill="%23FAF8F5" text-anchor="middle" letter-spacing="6">VELORA</text><text x="50%" y="54%" font-family="sans-serif" font-size="14" fill="%23A89F91" text-anchor="middle" letter-spacing="3">${encodedTitle}</text><text x="50%" y="58%" font-family="sans-serif" font-size="11" fill="%237A7265" text-anchor="middle" letter-spacing="2">MAISON DE LUXE</text></svg>`;
}
