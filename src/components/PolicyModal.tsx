import React from 'react';
import { X, ShieldCheck, FileText, Truck, RotateCcw } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'shipping' | 'returns';

interface PolicyModalProps {
  policyType: PolicyType | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  if (!policyType) return null;

  const getPolicyContent = () => {
    switch (policyType) {
      case 'privacy':
        return {
          title: 'Maison Privacy & Data Governance Protocol',
          icon: ShieldCheck,
          content: (
            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-light">
              <p>
                At <strong>VELORA Maison de Luxe</strong>, protecting the discretion, financial confidentiality, and personal identity of our patrons is an inviolable commitment.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">1. Data Architecture & Discretion</h4>
              <p>
                We collect personal identifiers exclusively required to deliver bespoke white-glove courier services and maintain your archived purchase certificates. We do not monetize, rent, or distribute client registers to third-party marketing entities under any condition.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">2. 256-Bit Cryptographic Security</h4>
              <p>
                All digital transactions and private messages are encrypted via AES-256 standard and TLS 1.3 protocol. Payment credentials are handled through PCI-DSS Level 1 certified vault protocols.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">3. The Right to Erasure</h4>
              <p>
                Patrons may request the unconditional erasure of their client dossier by submitting a signed directive to our Data Protection Officer at <em>concierge@velora-maison.com</em>.
              </p>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Acquisition & Client Covenant',
          icon: FileText,
          content: (
            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-light">
              <p>
                Every transaction executed on the VELORA digital platform constitutes an engagement with our Paris atelier registers under the following contractual parameters.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">1. Authenticity & Limited Editions</h4>
              <p>
                All creations are serialized and delivered with an archival certificate of authenticity. Because our pieces are fashioned from natural silks, full-grain hides, and untreated gemstones, subtle natural nuances are hallmarks of authentic handcraftsmanship.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">2. Orders & Cash on Delivery Protocol</h4>
              <p>
                For patrons choosing Cash on Delivery (COD), order placement signifies an unconditional agreement to receive the bonded courier at the indicated delivery coordinates and remit the certified total balance.
              </p>
            </div>
          )
        };
      case 'shipping':
        return {
          title: 'White-Glove Shipping & Global Logistics',
          icon: Truck,
          content: (
            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-light">
              <p>
                We partner exclusively with premium secure bonded couriers (FedEx Custom Critical, DHL Express Worldwide, and specialized art logistics carriers) to guarantee transit integrity.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">1. Complimentary Global Delivery</h4>
              <p>
                Qualifying orders qualify for complimentary insured white-glove transport. Transit timeframe: 3 to 5 business days worldwide, with express air delivery available at checkout.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">2. Priority Atelier Air Courier</h4>
              <p>
                For urgent acquisitions, Priority Air Courier delivers within 1 to 2 business days directly from our European fulfillment vault at a flat fee of $45.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">3. Customs, Duties & Archival Packaging</h4>
              <p>
                All import duties and tariffs are prepaid by VELORA. Every order arrives sealed in our signature charcoal archival box with gold-stamped wax ribbon.
              </p>
            </div>
          )
        };
      case 'returns':
        return {
          title: 'Bespoke 30-Day Returns & Exchange Service',
          icon: RotateCcw,
          content: (
            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-light">
              <p>
                Should a creation fail to meet your utmost expectations, our atelier will gladly orchestrate a complimentary return or exchange within thirty (30) calendar days of delivery.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">1. Condition of Returned Works</h4>
              <p>
                Items must remain unworn, unaltered, with all original security seals, ribbons, certificates of authenticity, and dust wrappers intact.
              </p>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">2. Complimentary Courier Collection</h4>
              <p>
                Contact our concierge to reserve a private insured pickup at your residence or office. Upon receipt and inspection at our atelier, credit is issued within 48 hours.
              </p>
            </div>
          )
        };
    }
  };

  const { title, icon: Icon, content } = getPolicyContent();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm shadow-2xl p-6 sm:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-full transition"
            aria-label="Close policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
          {content}
        </div>

        <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm hover:opacity-90 transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
