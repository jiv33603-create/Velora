import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, Check } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Acquisition Inquiry',
    orderId: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    const genTicket = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(genTicket);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm shadow-2xl p-6 sm:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400 font-semibold">
              Client Concierge
            </span>
            <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-normal">
              Contact The Maison
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-full transition"
            aria-label="Close contact modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
              Message Transmitted to Concierge
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              Your dossier reference is <strong>{ticketId}</strong>. A senior liaison officer will attend to your request within two business hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Atelier Coordinates */}
            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-400 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 pb-4 md:pb-0 md:pr-4">
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-1">
                  Atelier Central
                </span>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>18 Place Vendôme, 75001 Paris, France</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-1">
                  Client Services
                </span>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href="mailto:concierge@velora-maison.com" className="hover:underline">
                    concierge@velora.com
                  </a>
                </div>
              </div>

              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-1">
                  Telephone Concierge
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>+33 1 42 68 00 24</span>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Inquiry Nature
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none"
                  >
                    <option value="Acquisition Inquiry">Acquisition Inquiry</option>
                    <option value="Bespoke Sizing Consultation">Bespoke Sizing Consultation</option>
                    <option value="Order Tracking & Transit">Order Tracking & Transit</option>
                    <option value="Return / Courier Exchange">Return / Courier Exchange</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Order ID (If Applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VEL-2026-98124"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How may our atelier concierge assist you?"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-amber-400 dark:text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
