import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory
}) => {
  if (!isOpen) return null;

  const editorials = [
    {
      title: 'Act I: The Architecture of Drape',
      caption: 'Organza trench coats and double-faced Mongolian cashmere silhouettes against brutalist marble monoliths.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      category: 'Haute Couture' as ProductCategory
    },
    {
      title: 'Act II: Tuscan Mineral & Tannins',
      caption: 'Full-grain calfskin and raw brass locks seasoned in Montopoli workshops.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      category: 'Fine Leather' as ProductCategory
    },
    {
      title: 'Act III: Celestial Alignments',
      caption: 'Natural Colombian emeralds paired with recycled 18k solid gold collars.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      category: 'High Jewelry' as ProductCategory
    }
  ];

  return (
    <div id="lookbook-section" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold">
              The Maison Dossier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal">
              Autumn / Winter 2026 Lookbook
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lookbook Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-12">
          {editorials.map((act, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-stone-800/80 pb-12 last:border-b-0">
              <div className={`overflow-hidden rounded-sm aspect-[4/5] bg-stone-950 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  Plate 0{index + 1}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-stone-100">
                  {act.title}
                </h3>
                <p className="text-stone-400 text-sm font-light leading-relaxed">
                  {act.caption}
                </p>
                <div>
                  <button
                    onClick={() => {
                      onSelectCategory(act.category);
                      onClose();
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-amber-300 transition"
                  >
                    <span>View Category Pieces</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
