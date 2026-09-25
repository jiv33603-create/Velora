import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Gem, Award, Clock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const pillars = [
    {
      icon: Gem,
      title: 'Artisanal Provenance',
      description: 'Conceived and hand-finished in historic Parisian and Tuscan workshops.'
    },
    {
      icon: Truck,
      title: 'Complimentary Delivery',
      description: 'Fully insured white-glove transport on all qualifying atelier orders.'
    },
    {
      icon: RotateCcw,
      title: '30-Day Bespoke Returns',
      description: 'Effortless prepaid home pickup and dedicated concierge exchange.'
    },
    {
      icon: ShieldCheck,
      title: 'Certified Authenticity',
      description: 'Each piece arrives with a serialized hologram seal and archival chest.'
    }
  ];

  return (
    <section className="py-16 border-t border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={i}
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-4 rounded-sm"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-800/80 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
                  {pillar.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
