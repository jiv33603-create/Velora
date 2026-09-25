import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    sku: 'VEL-HC-001',
    title: 'Aura Silk-Organza Trench Coat',
    slug: 'aura-silk-organza-trench-coat',
    subtitle: 'Signature tailored outerwear in sheer weighted silk',
    category: 'Haute Couture',
    price: 1850,
    compareAtPrice: 2200,
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    stockCount: 5,
    isNew: true,
    isBestseller: true,
    badge: 'Maison Exclusive',
    description: 'Cut from fluid, featherweight Japanese silk-organza with sculptural horn buttons and an architectural drop shoulder. Designed to drape effortlessly over evening wear or tailored daywear.',
    details: [
      'Sculpted drop-shoulder silhouette with removable sash belt',
      'Hand-carved buffalo horn buttons with subtle logo engraving',
      'Internal French seams and reinforced cupro armhole facings',
      'Crafted in our Paris atelier'
    ],
    materials: '100% Japanese Silk-Organza (45 Momme)',
    care: 'Dry clean only by luxury silk specialists. Store on broad wooden hanger.',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Oatmeal Taupe', hex: '#D8CFBC' },
      { name: 'Noir Ébène', hex: '#1C1B1A' },
      { name: 'Ivory Crème', hex: '#F4EFEB' }
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'prod-02',
    sku: 'VEL-LG-002',
    title: 'The Palais Structured Calfskin Tote',
    slug: 'the-palais-structured-calfskin-tote',
    subtitle: 'Architectural handbag with 24k gold-plated brass lock',
    category: 'Fine Leather',
    price: 2400,
    rating: 5.0,
    reviewsCount: 52,
    inStock: true,
    stockCount: 8,
    isBestseller: true,
    badge: 'Iconic',
    description: 'An architectural heirloom piece fashioned from full-grain Tuscan calfskin with hand-painted edge coats and custom 24k gold-plated hardware. Features a suede-lined triple interior compartment.',
    details: [
      'Symmetric architectural gussets with magnetic top cinch',
      '24-karat gold-plated heavy brass clasp with dual security latch',
      'Micro-suede lined interior with zip pocket and smartphone sleeve',
      'Protective metal base feet'
    ],
    materials: 'Full-Grain Tuscan Calfskin Leather & Italian Velour Suede',
    care: 'Protect from direct sunlight and moisture. Clean with gentle beeswax balm.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Cognac Saddle', hex: '#8B4513' },
      { name: 'Midnight Obsidian', hex: '#111215' },
      { name: 'Bordeaux Rouge', hex: '#58111A' }
    ],
    sizes: ['Medium', 'Large']
  },
  {
    id: 'prod-03',
    sku: 'VEL-HJ-003',
    title: 'Solstice Pavé Emerald Collar Necklace',
    slug: 'solstice-pave-emerald-collar-necklace',
    subtitle: '18k recycled gold choker with Colombian emerald cut centerpiece',
    category: 'High Jewelry',
    price: 4950,
    compareAtPrice: 5400,
    rating: 4.95,
    reviewsCount: 19,
    inStock: true,
    stockCount: 3,
    badge: 'High Jewelry',
    description: 'Conceived in homage to celestial alignments, this articulated collar features a 2.4-carat ethically sourced Colombian emerald set in bezel-brushed 18k yellow gold with micro-pavé laboratory-certified diamonds.',
    details: [
      '18-karat recycled yellow gold (750 hallmark certified)',
      '2.4-carat octagonal step-cut Colombian natural emerald',
      '0.85ct VS1 F-color round brilliant diamonds',
      'Invisible box clasp with dual safety latch'
    ],
    materials: '18K Recycled Solid Yellow Gold, Natural Emerald, Conflict-Free Diamonds',
    care: 'Store in velvet presentation chest. Clean with specialized jewelry cloth.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: '18K Yellow Gold', hex: '#D4AF37' },
      { name: '18K White Gold', hex: '#E5E4E2' }
    ],
    sizes: ['38 cm', '42 cm']
  },
  {
    id: 'prod-04',
    sku: 'VEL-AF-004',
    title: 'Verona Sculpted Heeled Mule',
    slug: 'verona-sculpted-heeled-mule',
    subtitle: 'Nappa leather mule with geometric architectural heel',
    category: 'Artisan Footwear',
    price: 920,
    rating: 4.8,
    reviewsCount: 29,
    inStock: true,
    stockCount: 12,
    isNew: true,
    description: 'A masterclass in Italian shoemaking. Supple lambskin nappa upper cushioned with memory foam insoles, resting atop an 85mm hand-carved mahogany and brushed chrome block heel.',
    details: [
      '85mm contoured sculptural architectural block heel',
      'Buttery Italian glove-quality nappa leather upper',
      'Hand-stitched leather sole with injected non-slip rubber pad',
      'Handcrafted in Civitanova Marche, Italy'
    ],
    materials: '100% Italian Nappa Lambskin & Vegetable Tanned Leather Outsole',
    care: 'Condition leather regularly with neutral cream. Avoid soaking.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Bone Alabaster', hex: '#F0ECE1' },
      { name: 'Espresso Moro', hex: '#3B2F2F' },
      { name: 'Crimson Velvet', hex: '#7E191B' }
    ],
    sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41']
  },
  {
    id: 'prod-05',
    sku: 'VEL-FR-005',
    title: 'Extrait de Parfum: Santal Cendré',
    slug: 'extrait-de-parfum-santal-cendre',
    subtitle: 'Smoky Australian sandalwood, cardamom, violet & ambergris',
    category: 'Signature Fragrance',
    price: 360,
    rating: 4.9,
    reviewsCount: 64,
    inStock: true,
    stockCount: 20,
    isBestseller: true,
    badge: '30% Concentration',
    description: 'Formulated in Grasse with a potent 30% oil concentration. Opens with crisp crushed cardamom and iris petals before unravelling into deep Mysore sandalwood, smoked papyrus, and crystalline ambergris.',
    details: [
      'Top Notes: Guatemalan Green Cardamom, Violet Leaf, Bergamot',
      'Heart Notes: Iris Florentina, Tuscan Leather, Smoked Cedar',
      'Base Notes: Australian Sandalwood, Rare Ambergris, Indonesian Patchouli',
      '100ml Heavy smoked glass flacon with magnetic brass cap'
    ],
    materials: 'Organic alcohol base, pure botanical essences, aged wood oils',
    care: 'Keep in cool, dark sanctuary away from UV exposure.',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Amber Flacon', hex: '#C68B59' }
    ],
    sizes: ['50ml', '100ml']
  },
  {
    id: 'prod-06',
    sku: 'VEL-HC-006',
    title: 'Monolith Double-Faced Cashmere Cape',
    slug: 'monolith-double-faced-cashmere-cape',
    subtitle: 'Pure Mongolian grade-A cashmere with raw hand-sewn fringes',
    category: 'Haute Couture',
    price: 2150,
    rating: 4.88,
    reviewsCount: 23,
    inStock: true,
    stockCount: 4,
    badge: 'Limited Run',
    description: 'Spun from the finest underfleece of Mongolian mountain goats, double-faced and meticulously split and joined entirely by hand without visible seams. A majestic outer layer for cold evenings.',
    details: [
      'Hand-split double-faced construction (over 18 hours of hand-sewing)',
      'Asymmetrical foldover lapel with hidden magnet closure',
      'Deep welt pass-through pockets lined with silk charmeuse',
      'Zero synthetic fibers'
    ],
    materials: '100% Grade-A Pure Mongolian Cashmere',
    care: 'Dry clean only. Cedar storage bag provided.',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Charcoal Ardoise', hex: '#2F353B' },
      { name: 'Camel Vicuña', hex: '#C19A6B' },
      { name: 'Raw Sand', hex: '#E2D7C5' }
    ],
    sizes: ['One Size']
  },
  {
    id: 'prod-07',
    sku: 'VEL-HL-007',
    title: 'Aethel Travertine & Brass Candlestick Set',
    slug: 'aethel-travertine-brass-candlestick-set',
    subtitle: 'Pair of hand-carved Roman travertine monolith holders',
    category: 'Home & Living',
    price: 480,
    rating: 4.75,
    reviewsCount: 16,
    inStock: true,
    stockCount: 9,
    description: 'Quarried in Tivoli, Italy, each pedestal honors the natural veining and porous character of raw travertine marble, anchored with solid unlacquered satin brass taper cups.',
    details: [
      'Carved from single-block porous Italian travertine',
      'Unlacquered brushed solid brass inserts designed to develop a rich patina',
      'Weighted protective felt underside to safeguard delicate surfaces',
      'Includes pair of hand-dipped beeswax tapers'
    ],
    materials: 'Natural Italian Travertine Marble & Solid Brushed Brass',
    care: 'Wipe with damp micro-fiber cloth. Avoid acidic cleaning solutions.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Warm Travertine', hex: '#E6DEC9' }
    ],
    sizes: ['Set of 2 (24cm & 30cm)']
  },
  {
    id: 'prod-08',
    sku: 'VEL-LG-008',
    title: 'L’Infini Suede & Box Calf Crossbody',
    slug: 'linfini-suede-box-calf-crossbody',
    subtitle: 'Compact saddle silhouette with adjustable leather strap',
    category: 'Fine Leather',
    price: 1650,
    compareAtPrice: 1900,
    rating: 4.92,
    reviewsCount: 41,
    inStock: true,
    stockCount: 7,
    isBestseller: true,
    description: 'A harmonious interplay between mirror-smooth box calfskin and velvety calf suede. Styled with a sliding strap that converts effortlessly from high crossbody to shoulder carry.',
    details: [
      'Accordion dual gusset interior with card organizer slots',
      'Polished palladium-tone twist lock closure',
      'Reinforced perimeter saddle-stitching in waxed linen thread',
      'Handcrafted by generational artisans in Florence'
    ],
    materials: 'French Box Calf Leather & Calf Suede Lining',
    care: 'Buff gently with dry cotton flannel. Store in microfiber dust pouch.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Olive Sauge', hex: '#556B2F' },
      { name: 'Caramel Cuir', hex: '#C68B59' },
      { name: 'Noir Intemporel', hex: '#1C1B1A' }
    ],
    sizes: ['Standard']
  },
  {
    id: 'prod-09',
    sku: 'VEL-HJ-009',
    title: 'Elysian Baroque Pearl Drop Earrings',
    slug: 'elysian-baroque-pearl-drop-earrings',
    subtitle: 'Organic Australian South Sea pearls with diamond pavé studs',
    category: 'High Jewelry',
    price: 1780,
    rating: 4.96,
    reviewsCount: 31,
    inStock: true,
    stockCount: 6,
    isNew: true,
    badge: 'Artisanal One-of-a-Kind',
    description: 'No two pairs are identical. Naturally formed Australian South Sea baroque pearls displaying deep iridescent luster, suspended from handcrafted 18k molten gold nuggets dusted with brilliant diamonds.',
    details: [
      'Pair of selected 14-16mm Australian South Sea baroque pearls',
      '0.32ct conflict-free round brilliant diamonds (G/VS2)',
      '18-karat recycled yellow gold textured studs',
      'Secure silicone-backed alpha clutch closures'
    ],
    materials: '18K Yellow Gold, Australian South Sea Cultured Pearls, Diamonds',
    care: 'Apply cosmetics and perfume before wearing pearls. Wipe clean after wear.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Lustrous Pearl & Gold', hex: '#FDFBF7' }
    ],
    sizes: ['Standard Drop (32mm)']
  },
  {
    id: 'prod-10',
    sku: 'VEL-HC-010',
    title: 'Sartorial Pleated Wool Flannel Blazer',
    slug: 'sartorial-pleated-wool-flannel-blazer',
    subtitle: 'Double-breasted jacket tailored in English worsted wool',
    category: 'Haute Couture',
    price: 1980,
    rating: 4.85,
    reviewsCount: 27,
    inStock: true,
    stockCount: 5,
    description: 'A contemporary evolution of Savile Row heritage. Crafted from heavyweight 380g English worsted flannel wool with structured roped shoulders, peaked lapels, and pleated waist contouring.',
    details: [
      'Full floating horsehair canvas construction that molds to the body',
      'Working surgeon cuffs with genuine horn buttons',
      'Silk cupro jacquard interior lining with ticket pocket',
      'Hand-stitched pick detailing along collar and lapel'
    ],
    materials: '100% British Worsted Wool Flannel & 100% Cupro Bemberg Lining',
    care: 'Specialist dry clean only. Steam gently.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Chalkstripe Navy', hex: '#1E293B' },
      { name: 'Flannel Heather Grey', hex: '#64748B' }
    ],
    sizes: ['IT 46', 'IT 48', 'IT 50', 'IT 52']
  },
  {
    id: 'prod-11',
    sku: 'VEL-AF-011',
    title: 'The Riviera Braided Leather Loafer',
    slug: 'the-riviera-braided-leather-loafer',
    subtitle: 'Hand-woven calfskin slip-on with Blake-stitched sole',
    category: 'Artisan Footwear',
    price: 880,
    rating: 4.87,
    reviewsCount: 35,
    inStock: true,
    stockCount: 11,
    description: 'Intricately hand-woven by Tuscan artisans using supple vegetable-tanned strips. Extremely breathable yet structured, finished with a Blake-stitched leather sole and subtle stacked heel.',
    details: [
      'Interlocking hand-braided calfskin leather upper',
      'Blake-stitched Italian leather sole for flexibility and resolability',
      'Cushioned arch support with breathable calfskin lining',
      'Crafted in Montopoli in Val d’Arno'
    ],
    materials: '100% Vegetable-Tanned Italian Calfskin',
    care: 'Use cedar shoe trees between wears. Condition with leather balm.',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Tobacco Tan', hex: '#9C6644' },
      { name: 'Nero Classic', hex: '#1C1B1A' }
    ],
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']
  },
  {
    id: 'prod-12',
    sku: 'VEL-FR-012',
    title: 'Bougie Parfumée: Nuit Andalouse',
    slug: 'bougie-parfumee-nuit-andalouse',
    subtitle: 'Neroli, bitter orange blossom, cedar & white patchouli candle',
    category: 'Signature Fragrance',
    price: 145,
    rating: 4.94,
    reviewsCount: 88,
    inStock: true,
    stockCount: 25,
    isBestseller: true,
    description: 'Evoking the warm, moonlit courtyards of Seville. Hand-poured with non-GMO soy and coconut wax blend into a fluted amber porcelain vessel that glows like a beacon when lit.',
    details: [
      'Burn Time: 70-80 hours with clean smoke-free double cotton wick',
      'Scent Notes: Seville Orange Blossom, Sun-Drenched Fig, Moroccan Atlas Cedar',
      'Hand-fluted bisque porcelain vessel reusable as an art vessel',
      'Formulated without phthalates, parabens, or sulfates'
    ],
    materials: 'Natural Coconut & Soy Wax Blend, Pure Essential Fragrance Oils',
    care: 'Trim wick to 5mm before every lighting. Allow melt pool to reach vessel edge.',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Porcelain Blanc', hex: '#FAF9F6' }
    ],
    sizes: ['300g (10.5 oz)']
  }
];

export const CATEGORIES_METADATA = [
  {
    name: 'Haute Couture',
    tagline: 'Sculptural Tailoring & Silks',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    count: '14 Designs'
  },
  {
    name: 'Fine Leather',
    tagline: 'Artisanal Tuscan Hidecraft',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    count: '9 Heirlooms'
  },
  {
    name: 'High Jewelry',
    tagline: '18K Recycled Gold & Solitaires',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    count: '11 Pieces'
  },
  {
    name: 'Artisan Footwear',
    tagline: 'Blake-Stitched Italian Forms',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    count: '8 Silhouettes'
  },
  {
    name: 'Signature Fragrance',
    tagline: 'High Concentration Extraits',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    count: '6 Elixirs'
  },
  {
    name: 'Home & Living',
    tagline: 'Raw Marble & Brass Sculptures',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    count: '7 Objects'
  }
];
