import React from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  ArrowUp
} from 'lucide-react';
import { PolicyType } from './PolicyModal';

interface FooterProps {
  onOpenPolicy: (type: PolicyType) => void;
  onOpenContact: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicy,
  onOpenContact,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-stone-800">
          
          {/* Col 1 & 2: About Maison */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl tracking-[0.25em] text-stone-100 font-normal">
                VELORA
              </span>
            </div>
            <p className="text-xs tracking-[0.35em] text-amber-300/80 uppercase font-mono">
              Haute Couture • Fine Leather • High Jewelry
            </p>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
              Established in 1926. VELORA represents an uncompromising dedication to material purity, architectural proportions, and timeless heritage handcraftsmanship. Each piece is an heirloom designed to transcend generations.
            </p>

            <div className="flex items-center space-x-3 pt-2 text-stone-400">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 hover:text-amber-300 flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 hover:text-amber-300 flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 hover:text-amber-300 flex items-center justify-center transition"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-stone-100 font-semibold">
              Client Support
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>
                <button onClick={onOpenContact} className="hover:text-amber-300 transition">
                  Contact Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-amber-300 transition">
                  Shipping & Courier Protocol
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('returns')} className="hover:text-amber-300 transition">
                  Bespoke Returns (30-Day)
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-amber-300 transition">
                  Bespoke Sizing & Commission
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-amber-300 transition">
                  Track Consignment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-stone-100 font-semibold">
              Legal & Governance
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-amber-300 transition">
                  Privacy Policy & Discretion
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-amber-300 transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-amber-300 transition">
                  Customs & Duties Prepaid
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('returns')} className="hover:text-amber-300 transition">
                  Refund Covenant
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-stone-500 hover:text-amber-400 transition font-mono">
                  Administrator Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Ateliers & Presence */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-stone-100 font-semibold">
              Atelier Coordinates
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>18 Place Vendôme, 75001 Paris, France</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:concierge@velora-maison.com" className="hover:text-stone-100">
                  concierge@velora.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+33 1 42 68 00 24</span>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Methods & Trust Badges Strip */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-stone-900 text-xs">
          <div className="flex items-center gap-4 text-stone-400">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted Protocol</span>
            </span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="text-stone-400">COD Accepted</span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="text-stone-400">Direct Wire & Cards</span>
          </div>

          {/* Accepted Cards Simulation */}
          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-stone-400">
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">VISA</span>
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">MASTERCARD</span>
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">AMEX</span>
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">APPLE PAY</span>
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded text-emerald-400">CASH ON DELIVERY</span>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-light">
          <p>
            © {new Date().getFullYear()} VELORA Maison de Luxe Inc. All Rights Reserved. Master atelier registered in Paris, France.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-stone-200 transition"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
