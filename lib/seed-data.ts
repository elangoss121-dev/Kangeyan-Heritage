import type { Product } from './types'

export const SEED_PRODUCTS: Product[] = [
  {
    slug: 'cold-pressed-groundnut-oil',
    name: 'Cold Pressed Groundnut Oil',
    tamilName: 'செக்கு கடலை எண்ணெய்',
    category: 'cold-pressed-oils',
    shortDescription: 'Wood pressed, chemical free & unrefined groundnut oil.',
    description:
      'Our Cold Pressed Groundnut Oil is extracted the traditional way using a wooden churner (chekku), preserving its natural aroma, nutrients and flavour. Free from chemicals, sulphur and any refining process, it is perfect for daily South Indian cooking and deep frying.',
    highlights: [
      'Wood pressed (Marachekku)',
      '100% chemical & sulphur free',
      'Unrefined and unfiltered',
      'Rich, nutty natural aroma',
    ],
    image: '/products/groundnut-oil.png',
    gallery: [
      '/products/groundnut-oil.png',
      '/brand/ad-groundnut.jpeg',
      '/placeholder/lifestyle-1.jpg',
      '/placeholder/label-close.jpg',
      '/placeholder/texture.jpg',
    ],
    variants: [
      { size: '500 ml', price: 220, mrp: 260, sku: 'KH-GN-500' },
      { size: '1 litre', price: 410, mrp: 480, sku: 'KH-GN-1L' },
      { size: '5 litre', price: 1950, mrp: 2200, sku: 'KH-GN-5L' },
    ],
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    inStock: true,
    benefits: [
      {
        title: 'Heart Friendly',
        description: 'Naturally rich in good fats and vitamin E.',
      },
      {
        title: 'High Smoke Point',
        description: 'Ideal for deep frying and everyday tempering.',
      },
    ],
  },
  {
    slug: 'cold-pressed-coconut-oil',
    name: 'Cold Pressed Coconut Oil',
    tamilName: 'செக்கு தேங்காய் எண்ணெய்',
    category: 'cold-pressed-oils',
    shortDescription: 'Wood pressed, chemical free & unrefined coconut oil.',
    description:
      'Made from sun-dried coconuts and cold pressed in a wooden chekku, our coconut oil retains its sweet aroma and natural goodness. Perfect for cooking, hair care and skin care.',
    highlights: [
      'Wood pressed (Marachekku)',
      '100% chemical & sulphur free',
      'Unrefined and unfiltered',
      'Multipurpose: cooking, hair & skin',
    ],
    image: '/products/coconut-oil.png',
    gallery: [
      '/products/coconut-oil.png',
      '/brand/ad-coconut.jpeg',
      '/placeholder/lifestyle-1.jpg',
      '/placeholder/label-close.jpg',
      '/placeholder/texture.jpg',
    ],
    variants: [
      { size: '500 ml', price: 240, mrp: 280, sku: 'KH-CO-500' },
      { size: '1 litre', price: 450, mrp: 520, sku: 'KH-CO-1L' },
    ],
    rating: 4.9,
    reviewCount: 98,
    featured: true,
    inStock: true,
    benefits: [
      {
        title: 'Nourishing',
        description: 'Great for hair, skin and immunity.',
      },
      {
        title: 'Pure Aroma',
        description: 'Natural sweet coconut fragrance retained.',
      },
    ],
  },
  {
    slug: 'cold-pressed-palm-jaggery-sesame-oil',
    name: 'Cold Pressed Palm Jaggery Sesame Oil',
    tamilName: 'செக்கு கருப்பட்டி நல்லெண்ணெய்',
    category: 'cold-pressed-oils',
    shortDescription:
      'Wood pressed sesame oil enriched with palm jaggery, chemical free.',
    description:
      'A traditional Tamil favourite. Our sesame (gingelly) oil is wood pressed along with palm jaggery for a distinctive aroma and added nutrition. Excellent for cooking, oil baths and traditional remedies.',
    highlights: [
      'Wood pressed (Marachekku)',
      'Made with natural palm jaggery',
      '100% chemical & sulphur free',
      'Unrefined and unfiltered',
    ],
    image: '/products/sesame-oil.png',
    gallery: [
      '/products/sesame-oil.png',
      '/brand/ad-sesame.jpeg',
      '/placeholder/lifestyle-1.jpg',
      '/placeholder/label-close.jpg',
      '/placeholder/texture.jpg',
    ],
    variants: [
      { size: '500 ml', price: 260, mrp: 300, sku: 'KH-SE-500' },
      { size: '1 litre', price: 490, mrp: 560, sku: 'KH-SE-1L' },
    ],
    rating: 4.7,
    reviewCount: 76,
    featured: true,
    inStock: true,
    benefits: [
      {
        title: 'Traditional Recipe',
        description: 'Palm jaggery blended the heritage way.',
      },
      {
        title: 'Warming',
        description: 'Perfect for oil baths and tempering.',
      },
    ],
  },
  {
    slug: 'organic-jaggery-powder',
    name: 'Organic Jaggery Powder',
    tamilName: 'நாட்டு சக்கரை',
    category: 'jaggery',
    shortDescription: 'Organic & chemical free natural sweetener.',
    description:
      'Our Jaggery Powder is made from organically grown sugarcane, with no chemicals or artificial additives. A wholesome, mineral-rich alternative to white sugar for sweets, beverages and daily cooking.',
    highlights: [
      'Organic & chemical free',
      'No added colour or preservatives',
      'Rich in iron & minerals',
      'Healthy sugar alternative',
    ],
    image: '/products/jaggery-powder.png',
    gallery: [
      '/products/jaggery-powder.png',
      '/brand/ad-jaggery.jpeg',
      '/placeholder/lifestyle-1.jpg',
      '/placeholder/label-close.jpg',
      '/placeholder/texture.jpg',
    ],
    variants: [
      { size: '500 g', price: 90, mrp: 110, sku: 'KH-JG-500' },
      { size: '1 kg', price: 160, mrp: 190, sku: 'KH-JG-1KG' },
    ],
    rating: 4.8,
    reviewCount: 142,
    featured: true,
    inStock: true,
    benefits: [
      {
        title: 'Mineral Rich',
        description: 'Naturally contains iron and minerals.',
      },
      {
        title: 'Versatile',
        description: 'Use in sweets, coffee, and cooking.',
      },
    ],
  },
]
