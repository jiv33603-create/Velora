import React from 'react';
import { ArrowDown, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onLookbookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onLookbookClick }) => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-stone-900 text-stone-100">
      {/* Background High Fashion Editorial Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=85"
          alt="VELORA Autumn Winter Haute Couture"
          className="w-full h-full object-cover object-center opacity-45 transform scale-105 transition-transform duration-1000 ease-out"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-stone-950/30 to-stone-950/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        
        {/* Seasonal Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-stone-900/60 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[11px] font-medium tracking-[0.25em] text-amber-200 uppercase">
            The Autumn / Winter Capsule 2026
          </span>
        </div>

        {/* Majestic Editorial Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.12em] text-stone-100 mb-6 leading-[1.08] max-w-4xl">
          ELEGANCE <span className="italic font-normal font-serif text-amber-200">IN SILENCE</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-stone-300 text-base sm:text-lg md:text-xl font-light tracking-wide mb-10 leading-relaxed">
          Contemporary haute couture, sculptural leathergoods, and ethical fine jewelry. 
          Hand-finished in historic European ateliers for the discerning collector.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 bg-amber-200 hover:bg-amber-100 text-stone-950 font-medium text-xs tracking-[0.25em] uppercase transition duration-300 shadow-xl shadow-amber-900/20 hover:scale-[1.02]"
          >
            Explore Collection
          </button>
          
          <button
            onClick={onLookbookClick}
            className="w-full sm:w-auto px-8 py-4 bg-stone-900/80 hover:bg-stone-800 text-stone-100 border border-stone-700/80 font-medium text-xs tracking-[0.25em] uppercase transition duration-300 backdrop-blur-sm"
          >
            The Atelier Lookbook
          </button>
        </div>

        {/* Artisanal Heritage Highlights */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 mt-16 pt-10 border-t border-stone-800/80 w-full max-w-3xl text-left sm:text-center">
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-amber-200 font-normal">100%</div>
            <div className="text-[10px] sm:text-xs tracking-widest text-stone-400 uppercase mt-1">Artisanal Provenance</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-amber-200 font-normal">18K</div>
            <div className="text-[10px] sm:text-xs tracking-widest text-stone-400 uppercase mt-1">Recycled Fine Gold</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-amber-200 font-normal">Paris</div>
            <div className="text-[10px] sm:text-xs tracking-widest text-stone-400 uppercase mt-1">Bespoke Workshop</div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <button 
        onClick={onExploreClick}
        aria-label="Scroll to collection"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-400 hover:text-white transition duration-300 p-2 animate-bounce"
      >
        <ArrowDown className="w-5 h-5 opacity-70" />
      </button>
    </section>
  );
};
