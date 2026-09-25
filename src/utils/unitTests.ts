import { UnitTestResult, CartItem, Product, CustomerInfo, DeliveryAddress } from '../types';
import { generateOrderId, validatePromoCode } from './formatters';

export function calculateSubtotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calculateShipping(subtotalAfterDiscount: number, methodId: string = 'standard'): number {
  if (methodId === 'express') return 45;
  if (subtotalAfterDiscount >= 250) return 0;
  return 25;
}

export function calculateEstimatedTax(subtotalAfterDiscount: number): number {
  return Math.round(subtotalAfterDiscount * 0.08);
}

export function validateCustomerInfo(customer: Partial<CustomerInfo>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!customer.name || customer.name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer.email || !emailRegex.test(customer.email.trim())) {
    errors.push('Valid email address is required');
  }
  const phoneClean = (customer.phone || '').replace(/[^0-9]/g, '');
  if (!phoneClean || phoneClean.length < 8) {
    errors.push('Valid contact phone number is required');
  }
  return { valid: errors.length === 0, errors };
}

export function validateAddress(address: Partial<DeliveryAddress>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!address.street || address.street.trim().length < 4) errors.push('Street address is required');
  if (!address.city || address.city.trim().length < 2) errors.push('City is required');
  if (!address.state || address.state.trim().length < 2) errors.push('State / Province is required');
  if (!address.postalCode || address.postalCode.trim().length < 3) errors.push('Postal / ZIP code is required');
  if (!address.country || address.country.trim().length < 2) errors.push('Country is required');
  return { valid: errors.length === 0, errors };
}

// Complete in-memory automated test suite runner
export function runCoreUnitTests(): { total: number; passed: number; failed: number; results: UnitTestResult[] } {
  const results: UnitTestResult[] = [];

  const runTest = (id: string, name: string, category: string, fn: () => void) => {
    const t0 = performance.now();
    try {
      fn();
      results.push({
        id,
        name,
        category,
        passed: true,
        durationMs: Math.round((performance.now() - t0) * 100) / 100
      });
    } catch (err: any) {
      results.push({
        id,
        name,
        category,
        passed: false,
        durationMs: Math.round((performance.now() - t0) * 100) / 100,
        message: err.message || 'Assertion failed'
      });
    }
  };

  // 1. Cart Subtotal Calculations
  runTest('TEST-01', 'Calculate empty cart subtotal = 0', 'Cart Engine', () => {
    if (calculateSubtotal([]) !== 0) throw new Error('Expected 0 for empty cart');
  });

  runTest('TEST-02', 'Calculate multi-item cart subtotal correctly', 'Cart Engine', () => {
    const items = [
      { price: 1850, quantity: 2 }, // 3700
      { price: 360, quantity: 1 }   // 360
    ];
    if (calculateSubtotal(items) !== 4060) throw new Error('Expected 4060, got ' + calculateSubtotal(items));
  });

  // 2. Promotional Code Rules
  runTest('TEST-03', 'Apply VELORA10 promo code gives 10%', 'Promo & Discounts', () => {
    const res = validatePromoCode('VELORA10');
    if (!res.valid || res.discountPercent !== 10) throw new Error('Failed to validate VELORA10');
  });

  runTest('TEST-04', 'Case-insensitive promo code parsing', 'Promo & Discounts', () => {
    const res = validatePromoCode('  luxe20  ');
    if (!res.valid || res.discountPercent !== 20) throw new Error('Failed to parse trimmed lowercase luxe20');
  });

  runTest('TEST-05', 'Reject invalid promo code securely', 'Promo & Discounts', () => {
    const res = validatePromoCode('FAKE_CODE_999');
    if (res.valid || res.discountPercent !== 0) throw new Error('Invalid code should return valid=false');
  });

  // 3. Shipping Rules & Free Shipping Threshold
  runTest('TEST-06', 'Complimentary shipping over $250 threshold', 'Shipping Rules', () => {
    const fee = calculateShipping(300, 'standard');
    if (fee !== 0) throw new Error('Expected complimentary shipping ($0), got ' + fee);
  });

  runTest('TEST-07', 'Standard shipping fee applied below $250', 'Shipping Rules', () => {
    const fee = calculateShipping(145, 'standard');
    if (fee !== 25) throw new Error('Expected $25 shipping under threshold, got ' + fee);
  });

  runTest('TEST-08', 'Express priority shipping fixed fee', 'Shipping Rules', () => {
    const fee = calculateShipping(500, 'express');
    if (fee !== 45) throw new Error('Expected $45 for express priority, got ' + fee);
  });

  // 4. Order ID Generation Format
  runTest('TEST-09', 'Order ID adheres to VEL-YYYY-XXXXX format', 'Order System', () => {
    const id = generateOrderId();
    const regex = /^VEL-\d{4}-\d{5}$/;
    if (!regex.test(id)) throw new Error('Order ID does not match pattern: ' + id);
  });

  // 5. Customer Contact Validation
  runTest('TEST-10', 'Validate complete customer contact info', 'Form Validation', () => {
    const val = validateCustomerInfo({
      name: 'Eleanor Vance',
      email: 'eleanor.vance@maison.com',
      phone: '+1 (555) 234-5678'
    });
    if (!val.valid) throw new Error('Valid customer info was rejected');
  });

  runTest('TEST-11', 'Reject malformed customer email', 'Form Validation', () => {
    const val = validateCustomerInfo({
      name: 'Eleanor Vance',
      email: 'invalid-email-address',
      phone: '+1 555-234-5678'
    });
    if (val.valid) throw new Error('Malformed email should have failed validation');
  });

  // 6. Delivery Address Validation
  runTest('TEST-12', 'Validate complete delivery address', 'Form Validation', () => {
    const val = validateAddress({
      street: '740 Park Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States'
    });
    if (!val.valid) throw new Error('Complete address failed validation');
  });

  runTest('TEST-13', 'Reject incomplete delivery address missing city', 'Form Validation', () => {
    const val = validateAddress({
      street: '740 Park Avenue',
      city: '',
      state: 'NY',
      postalCode: '10021',
      country: 'United States'
    });
    if (val.valid) throw new Error('Address missing city should have failed');
  });

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  return {
    total: results.length,
    passed,
    failed,
    results
  };
}
