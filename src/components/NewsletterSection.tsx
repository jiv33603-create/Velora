import React, { useState } from 'react';
import { Mail, Check, Sparkles, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please provide a valid confidential email address');
      return;
    }
    setError('');
    setIsSubscribed(true);
  };

  return (
    <section className="py-20 bg-stone-900 text-stone-100 border-y border-stone-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-stone-800/80 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200 font-medium">
            The VELORA Privé Journal
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-stone-100 mb-4">
          Receive Private Vernissages & Atelier Previews
        </h2>
        
        <p className="text-stone-400 text-sm max-w-lg mx-auto font-light leading-relaxed mb-8">
          Join our global registry of collectors. You will receive private previews of seasonal capsules, bespoke commissions, and an inaugural courtesy courtesy code for your first acquisition.
        </p>

        {isSubscribed ? (
          <div className="max-w-md mx-auto p-6 bg-stone-800/90 border border-amber-400/40 rounded-sm text-center animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-stone-100">
              Welcome to VELORA Privé
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              Your registration is confirmed. Enjoy your inaugural courtesy privilege:
            </p>
            <div className="mt-3 inline-block px-4 py-1.5 bg-stone-950 font-mono text-sm tracking-widest text-amber-300 border border-amber-400/30 rounded">
              CODE: WELCOME15
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your confidential email..."
                  className="w-full pl-10 pr-4 py-3.5 bg-stone-950 border border-stone-700 rounded-sm text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold text-xs uppercase tracking-widest rounded-sm transition flex items-center justify-center gap-2 shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 text-left pl-1">{error}</p>
            )}
            <p className="text-[10px] text-stone-500 tracking-wider pt-2">
              Zero spam. Unsubscribe with one click anytime. Strict Swiss privacy governance.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
