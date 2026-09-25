import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Printer, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle,
  Clock,
  Package,
  Send,
  ExternalLink
} from 'lucide-react';
import { 
  CartItem, 
  CurrencyCode, 
  CustomerInfo, 
  DeliveryAddress, 
  PaymentMethodType, 
  ShippingMethod, 
  Order,
  IntegrationSettings 
} from '../types';
import { formatPrice, generateOrderId, formatDate, getFallbackImage } from '../utils/formatters';
import { validateCustomerInfo, validateAddress } from '../utils/unitTests';
import { submitOrderApi, CheckoutApiResponse } from '../services/apiService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  promoCode?: string;
  promoDiscountPercent?: number;
  onOrderCompleted: (order: Order) => void;
  integrationSettings: IntegrationSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  promoCode = '',
  promoDiscountPercent = 0,
  onOrderCompleted,
  integrationSettings
}) => {
  if (!isOpen) return null;

  // Checkout Steps: 1: Contact, 2: Shipping, 3: Payment, 4: Confirmed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    suite: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>({
    id: 'standard',
    name: 'Complimentary White-Glove Atelier Delivery',
    price: 0,
    estimatedDays: '3-5 business days',
    description: 'Bespoke insured courier with signature required'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('ONLINE');

  // Credit Card fields (for online payment)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [apiResponseDetails, setApiResponseDetails] = useState<CheckoutApiResponse | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const discountAmount = Math.round(subtotal * (promoDiscountPercent / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shippingFee = selectedShippingMethod.id === 'express' ? 45 : (subtotalAfterDiscount >= 250 ? 0 : 25);
  const estimatedTax = Math.round(subtotalAfterDiscount * 0.08);
  const totalAmount = subtotalAfterDiscount + shippingFee + estimatedTax;

  // Step 1 Validation
  const handleProceedToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateCustomerInfo(customer);
    if (!val.valid) {
      setValidationErrors(val.errors);
      return;
    }
    setValidationErrors([]);
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateAddress(deliveryAddress);
    if (!val.valid) {
      setValidationErrors(val.errors);
      return;
    }
    setValidationErrors([]);
    setCurrentStep(3);
  };

  // Final Order Submission
  const handlePlaceOrder = async () => {
    setValidationErrors([]);

    if (paymentMethod === 'ONLINE') {
      const cleanCard = cardDetails.number.replace(/\s+/g, '');
      if (cleanCard.length < 15) {
        setValidationErrors(['Please enter a valid 16-digit credit card number']);
        return;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 4) {
        setValidationErrors(['Please enter expiration date (MM/YY)']);
        return;
      }
      if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
        setValidationErrors(['Please enter a valid 3 or 4-digit CVC security code']);
        return;
      }
    }

    setIsSubmitting(true);

    const orderId = generateOrderId();
    const orderData: Order = {
      orderId,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      customer,
      deliveryAddress,
      items: items.map(i => ({
        productId: i.product?.id || `prod-${Math.random()}`,
        title: i.product?.title || 'Bespoke Item',
        price: i.product?.price || 0,
        quantity: i.quantity || 1,
        size: i.selectedSize || 'Standard',
        color: i.selectedColor?.name || 'Standard',
        image: (i.product?.images && i.product.images[0]) || getFallbackImage(i.product?.title || 'Creation')
      })),
      paymentMethod,
      paymentDetails: {
        method: paymentMethod === 'COD' ? 'Cash on Delivery (Pay upon Receipt)' : 'Verified Visa/Mastercard Encrypted Transaction',
        status: 'authorized',
        last4: paymentMethod === 'ONLINE' ? cardDetails.number.slice(-4) || '8842' : undefined,
        transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      },
      shippingMethod: {
        ...selectedShippingMethod,
        price: shippingFee
      },
      summary: {
        subtotal,
        discount: discountAmount,
        shipping: shippingFee,
        tax: estimatedTax,
        total: totalAmount,
        promoCode: promoDiscountPercent > 0 ? promoCode : undefined
      }
    };

    try {
      // Dispatch via server-side endpoint with Telegram and Google Apps Script support
      const response = await submitOrderApi(
        orderData,
        {
          botToken: integrationSettings.telegramBotToken,
          chatId: integrationSettings.telegramChatId
        },
        integrationSettings.appsScriptUrl
      );

      setConfirmedOrder(orderData);
      setApiResponseDetails(response);
      onOrderCompleted(orderData);
      setCurrentStep(4);
    } catch (err: any) {
      setValidationErrors([err.message || 'Checkout processing failed. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl tracking-[0.2em] font-normal text-stone-900 dark:text-stone-100">
              VELORA
            </span>
            <span className="text-xs uppercase tracking-widest text-stone-400 pl-3 border-l border-stone-300 dark:border-stone-700">
              Maison Checkout
            </span>
          </div>

          {currentStep !== 4 && (
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Progress Bar */}
        {currentStep !== 4 && (
          <div className="px-6 py-3 bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep >= 1 ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
              }`}>
                1
              </span>
              <span className={currentStep === 1 ? 'font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-500'}>
                Client Details
              </span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />

            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep >= 2 ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
              }`}>
                2
              </span>
              <span className={currentStep === 2 ? 'font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-500'}>
                Delivery Destination
              </span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />

            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep >= 3 ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
              }`}>
                3
              </span>
              <span className={currentStep === 3 ? 'font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-500'}>
                Payment & Protocol
              </span>
            </div>
          </div>
        )}

        {/* Validation Errors Alert Box */}
        {validationErrors.length > 0 && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-sm text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Please review the following details:</p>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: Client Information */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToShipping} className="max-w-xl mx-auto space-y-5">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-normal">
                  Client Profile
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  We use these coordinates exclusively for confidential dispatch verification and tracking notices.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Lady Vivienne Montgomery"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                    Email Address (For Order Dossier) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="vivienne@montgomery-estate.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                    Mobile Telephone (For Courier Coordination) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    White-glove carriers require direct courier telephone coordination prior to parcel delivery.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-amber-400 dark:text-stone-950 text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition flex items-center gap-2"
                >
                  <span>Continue to Delivery</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery Destination */}
          {currentStep === 2 && (
            <form onSubmit={handleProceedToPayment} className="max-w-xl mx-auto space-y-5">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-normal">
                  Delivery Destination
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Specify the precise residential or atelier address for insured dispatch.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    placeholder="740 Park Avenue"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                    Apartment / Suite / Floor (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.suite}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, suite: e.target.value })}
                    placeholder="Penthouse 14B"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      placeholder="New York"
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                      placeholder="NY"
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress.postalCode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                      placeholder="10021"
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      Country *
                    </label>
                    <select
                      value={deliveryAddress.country}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Germany">Germany</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Japan">Japan</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="pt-2">
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Select Atelier Courier Protocol
                  </label>
                  <div className="space-y-2">
                    <div
                      onClick={() => setSelectedShippingMethod({
                        id: 'standard',
                        name: 'Complimentary White-Glove Atelier Delivery',
                        price: 0,
                        estimatedDays: '3-5 business days',
                        description: 'Dispatched via carbon-neutral luxury transit'
                      })}
                      className={`p-3.5 rounded-sm border cursor-pointer flex items-center justify-between transition ${
                        selectedShippingMethod.id === 'standard'
                          ? 'border-stone-900 bg-stone-100 dark:border-amber-400 dark:bg-stone-800/80'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                            White-Glove Standard (3-5 Days)
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Signature on delivery & archival gift packaging
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                        {subtotalAfterDiscount >= 250 ? 'FREE' : formatPrice(25, currency)}
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedShippingMethod({
                        id: 'express',
                        name: 'Priority Atelier Air Courier',
                        price: 45,
                        estimatedDays: '1-2 business days',
                        description: 'Priority flight dispatch directly from Paris/Milan'
                      })}
                      className={`p-3.5 rounded-sm border cursor-pointer flex items-center justify-between transition ${
                        selectedShippingMethod.id === 'express'
                          ? 'border-stone-900 bg-stone-100 dark:border-amber-400 dark:bg-stone-800/80'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <div>
                          <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                            Priority Air Courier (1-2 Days)
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Dedicated flight dispatch with bespoke GPS live tracking
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                        {formatPrice(45, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-amber-400 dark:text-stone-950 text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment & Placement */}
          {currentStep === 3 && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-normal">
                  Payment Protocol
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Choose between verified electronic card transaction or Cash on Delivery (COD).
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-4 rounded-sm border cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === 'ONLINE'
                      ? 'border-stone-900 bg-stone-100 dark:border-amber-400 dark:bg-stone-800/80'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    <span className="w-3.5 h-3.5 rounded-full border flex items-center justify-center border-stone-400">
                      {paymentMethod === 'ONLINE' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                    Online Card Payment
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    Visa, Mastercard, Amex, Apple Pay
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-sm border cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === 'COD'
                      ? 'border-stone-900 bg-stone-100 dark:border-amber-400 dark:bg-stone-800/80'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="w-3.5 h-3.5 rounded-full border flex items-center justify-center border-stone-400">
                      {paymentMethod === 'COD' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                    Cash on Delivery (COD)
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    Settle with courier upon presentation
                  </div>
                </div>
              </div>

              {/* Online Card Details Form */}
              {paymentMethod === 'ONLINE' && (
                <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2.5">
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                      Encrypted Card Terminal
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Secured
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardDetails.number}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardDetails({ ...cardDetails, number: v });
                      }}
                      placeholder="4532 8920 1842 9012"
                      className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '');
                          if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                          setCardDetails({ ...cardDetails, expiry: v });
                        }}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '') })}
                        placeholder="CVC"
                        className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COD Disclaimer */}
              {paymentMethod === 'COD' && (
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-sm text-xs space-y-2">
                  <div className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery Verification Protocol</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                    By selecting COD, an official verification dispatch notice will be sent to your mobile phone. 
                    Please prepare exact currency of <strong>{formatPrice(totalAmount, currency)}</strong> or bank draft upon arrival of our licensed bonded courier.
                  </p>
                </div>
              )}

              {/* Order Total Review */}
              <div className="p-4 bg-stone-100 dark:bg-stone-950 rounded-sm space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Items Subtotal</span>
                  <span className="font-mono text-stone-900 dark:text-stone-100">{formatPrice(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-600 font-medium">
                    <span>Privé Privilege ({promoCode})</span>
                    <span className="font-mono">-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery ({selectedShippingMethod.name.split(' ')[0]})</span>
                  <span className="font-mono text-stone-900 dark:text-stone-100">
                    {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Atelier Tax (8%)</span>
                  <span className="font-mono text-stone-900 dark:text-stone-100">{formatPrice(estimatedTax, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatPrice(totalAmount, currency)}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-amber-400 dark:text-stone-950 text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition flex items-center gap-2 shadow-xl shadow-stone-900/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Order...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Authorize & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmed & Receipt Dossier */}
          {currentStep === 4 && confirmedOrder && (
            <div className="max-w-2xl mx-auto space-y-8 py-4">
              
              {/* Success Banner */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
                  Gratitude From The Maison
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  Your acquisition has been committed to our Parisian master registers under official Order ID:
                </p>
                <div className="inline-block px-5 py-2 bg-stone-900 text-amber-300 font-mono text-lg font-bold tracking-widest rounded-sm border border-amber-400/40">
                  {confirmedOrder.orderId}
                </div>
              </div>

              {/* Telegram & Google Apps Script Dispatch Status report */}
              {apiResponseDetails?.notifications && (
                <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm space-y-2 text-xs">
                  <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Send className="w-3.5 h-3.5 text-amber-600" />
                    <span>Real-Time Integration Dispatch Status</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded flex items-center justify-between">
                      <span>Telegram Alert Dispatch:</span>
                      <span className={`font-medium ${apiResponseDetails.notifications.telegram.success ? 'text-emerald-600' : 'text-stone-400'}`}>
                        {apiResponseDetails.notifications.telegram.success ? 'Delivered' : 'Standby / Tested'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded flex items-center justify-between">
                      <span>Google Sheets Sync:</span>
                      <span className={`font-medium ${apiResponseDetails.notifications.appsScript.success ? 'text-emerald-600' : 'text-stone-400'}`}>
                        {apiResponseDetails.notifications.appsScript.success ? 'Logged' : 'Standby / Tested'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Tracking Progress Line */}
              <div className="p-6 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm">
                <h4 className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-6 text-center">
                  Live Dispatch Timeline
                </h4>
                <div className="flex items-center justify-between max-w-lg mx-auto relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-medium text-stone-900 dark:text-stone-100 mt-2">Placed</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-medium text-stone-900 dark:text-stone-100 mt-2">Atelier Prep</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-400 flex items-center justify-center text-xs">
                      <Package className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-medium text-stone-400 mt-2">Transit</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-400 flex items-center justify-center text-xs">
                      <Truck className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-medium text-stone-400 mt-2">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Itemized Order Receipt Details */}
              <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <div className="font-serif text-lg text-stone-900 dark:text-stone-100">Dossier Receipt</div>
                    <div className="text-[11px] text-stone-400">Date: {formatDate(confirmedOrder.createdAt)}</div>
                  </div>
                  <button
                    onClick={handlePrintReceipt}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 dark:border-stone-800 rounded text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Receipt
                  </button>
                </div>

                {/* Items */}
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">
                          {item.title} <span className="font-mono text-stone-400">(Qty: {item.quantity})</span>
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Size: {item.size} • Color: {item.color}
                        </div>
                      </div>
                      <div className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary numbers */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(confirmedOrder.summary.subtotal, currency)}</span>
                  </div>
                  {confirmedOrder.summary.discount > 0 && (
                    <div className="flex justify-between text-amber-600 font-medium">
                      <span>Privé Discount</span>
                      <span className="font-mono">-{formatPrice(confirmedOrder.summary.discount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Insured Delivery</span>
                    <span className="font-mono">
                      {confirmedOrder.summary.shipping === 0 ? 'Complimentary' : formatPrice(confirmedOrder.summary.shipping, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="font-mono">{formatPrice(confirmedOrder.summary.tax, currency)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span>Total Paid / Due</span>
                    <span className="font-mono">{formatPrice(confirmedOrder.summary.total, currency)}</span>
                  </div>
                </div>

                {/* Delivery & Payment Method info */}
                <div className="pt-4 grid grid-cols-2 gap-4 text-xs border-t border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                      Courier Destination
                    </span>
                    <p className="font-medium text-stone-800 dark:text-stone-200">{confirmedOrder.customer.name}</p>
                    <p className="text-stone-500">{confirmedOrder.deliveryAddress.street}</p>
                    <p className="text-stone-500">
                      {confirmedOrder.deliveryAddress.city}, {confirmedOrder.deliveryAddress.state} {confirmedOrder.deliveryAddress.postalCode}
                    </p>
                    <p className="text-stone-500">{confirmedOrder.deliveryAddress.country}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                      Payment Protocol
                    </span>
                    <p className="font-medium text-stone-800 dark:text-stone-200">
                      {confirmedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Card Transaction'}
                    </p>
                    <p className="text-stone-500">{confirmedOrder.paymentDetails.method}</p>
                    <p className="text-stone-500 font-mono text-[10px] mt-1">Ref: {confirmedOrder.paymentDetails.transactionId}</p>
                  </div>
                </div>
              </div>

              {/* Close / Return Button */}
              <div className="text-center pt-2">
                <button
                  onClick={onClose}
                  className="px-10 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-amber-400 dark:text-stone-950 font-semibold text-xs uppercase tracking-[0.25em] rounded-sm transition"
                >
                  Return to Storefront
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
