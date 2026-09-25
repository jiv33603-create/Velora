import React from 'react';
import { ProductCategory } from '../types';
import { CATEGORIES_METADATA } from '../data/initialProducts';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: ProductCategory) => void;
  activeCategory: ProductCategory;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onSelectCategory,
  activeCategory
}) => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 font-semibold">
            Curated Metiers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal tracking-wide mt-2">
            Signature Departments
          </h2>
        </div>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mt-3 md:mt-0 font-light">
          Each creation is conceived in small, numbered batches with uncompromising attention to proportion, material, and lineage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_METADATA.map((cat) => {
          const isSelected = activeCategory === cat.name;
          return (
            <div
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name as ProductCategory);
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group relative h-96 overflow-hidden cursor-pointer rounded-sm border transition-all duration-500 ${
                isSelected 
                  ? 'border-amber-600 dark:border-amber-400 shadow-2xl scale-[1.01]' 
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
              }`}
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent opacity-80 group-hover:opacity-75 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-stone-100">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-mono tracking-widest uppercase bg-stone-900/60 backdrop-blur-md px-3 py-1 rounded text-stone-300">
                    {cat.count}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-stone-900/70 backdrop-blur-md flex items-center justify-center text-stone-300 group-hover:bg-amber-300 group-hover:text-stone-950 transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-200 font-medium mb-1">
                    {cat.tagline}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl text-stone-50 font-normal tracking-wide">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
