import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Product from '../backend/models/Product.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', 'api', '.env') });

const products = [
  // ===== FACE =====
  {
    name: 'Luminous Foundation', brand: 'Maybelline', category: 'face',
    description: 'A lightweight, buildable foundation that provides a natural luminous finish. Infused with hyaluronic acid for all-day hydration. Medium to full coverage that feels like second skin.',
    ingredients: 'Aqua, Cyclopentasiloxane, Glycerin, Dimethicone, Hyaluronic Acid, Titanium Dioxide, Tocopherol',
    howToUse: 'Apply with fingertips, brush, or sponge starting from the center of the face blending outward.',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'],
    variants: [
      { label: 'Ivory', price: 849, originalPrice: 999, stock: 45 },
      { label: 'Sand', price: 849, originalPrice: 999, stock: 38 },
      { label: 'Tan', price: 849, originalPrice: 999, stock: 22 },
    ],
    tags: ['foundation', 'face', 'makeup', 'luminous'],
    skinTypes: ['normal', 'dry', 'combination'],
    isFeatured: true,
  },
  {
    name: 'Full Coverage Concealer', brand: 'L\'Oreal Paris', category: 'face',
    description: 'High-coverage concealer that hides dark circles, blemishes, and imperfections without creasing. Enriched with vitamin E for a smooth, creamy texture.',
    ingredients: 'Aqua, Dimethicone, Glycerin, Silica, Tocopheryl Acetate, Iron Oxides',
    howToUse: 'Dab directly onto imperfections or under-eye area. Blend with fingertip or brush.',
    images: ['https://images.unsplash.com/photo-1631730359713-6b8f1c7bd7d2?w=600', 'https://images.unsplash.com/photo-1598803666444-9f56b5b296f8?w=600'],
    variants: [
      { label: 'Fair', price: 549, originalPrice: 699, stock: 60 },
      { label: 'Medium', price: 549, originalPrice: 699, stock: 55 },
      { label: 'Deep', price: 549, stock: 30 },
    ],
    tags: ['concealer', 'face', 'makeup', 'coverage'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Mattifying Primer', brand: 'NYX Professional', category: 'face',
    description: 'Smooth-on primer that minimizes the appearance of pores and controls shine for up to 12 hours. Creates the perfect canvas for foundation application.',
    ingredients: 'Aqua, Dimethicone, Silica, Polymethylsilsesquioxane, Tocopherol, Panthenol',
    howToUse: 'Apply a pea-sized amount to clean, moisturized skin before foundation.',
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600'],
    variants: [
      { label: '30ml', price: 449, stock: 75 },
      { label: '50ml', price: 699, stock: 40 },
    ],
    tags: ['primer', 'face', 'makeup', 'mattifying', 'pores'],
    skinTypes: ['oily', 'combination'],
  },
  {
    name: 'Baked Highlighter', brand: 'Wet n Wild', category: 'face',
    description: 'Baked highlighter that delivers a stunning, luminous glow. The unique baked formula provides a silky smooth texture that blends seamlessly into skin.',
    ingredients: 'Talc, Dimethicone, Nylon-12, Zinc Stearate, Tocopheryl Acetate, Iron Oxides',
    howToUse: 'Swirl a brush over the dome and dust onto cheekbones, brow bone, and cupid\'s bow.',
    images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=600', 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600'],
    variants: [
      { label: 'Golden', price: 349, stock: 90 },
      { label: 'Pink', price: 349, stock: 85 },
      { label: 'Bronze', price: 349, stock: 60 },
    ],
    tags: ['highlighter', 'face', 'makeup', 'glow'],
    skinTypes: ['all'],
  },
  {
    name: 'Setting Powder', brand: 'Lakme', category: 'face',
    description: 'Ultra-fine setting powder that locks in makeup and controls shine. The micro-fine particles blur imperfections and give a flawless airbrushed finish.',
    ingredients: 'Talc, Silica, Dimethicone, Nylon-12, Zinc Stearate, Iron Oxides',
    howToUse: 'Apply with a fluffy brush or powder puff after foundation and concealer.',
    images: ['https://images.unsplash.com/photo-1598803666444-9f56b5b296f8?w=600'],
    variants: [
      { label: 'Translucent', price: 399, stock: 70 },
      { label: 'Natural', price: 399, stock: 50 },
    ],
    tags: ['powder', 'face', 'makeup', 'setting'],
    skinTypes: ['oily', 'combination'],
    isFeatured: true,
  },
  {
    name: 'Blush Palette', brand: 'Sugar Cosmetics', category: 'face',
    description: 'A curated palette of 3 complementary blush shades. Highly pigmented, blendable formulas that give a natural flush to the cheeks.',
    ingredients: 'Talc, Mica, Magnesium Stearate, Dimethicone, Iron Oxides, Tocopheryl Acetate',
    howToUse: 'Apply with a blush brush to the apples of cheeks and blend upward.',
    images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600'],
    variants: [
      { label: 'Rose Garden', price: 549, stock: 40 },
      { label: 'Peach Party', price: 549, stock: 55 },
      { label: 'Berry Burst', price: 549, stock: 35 },
    ],
    tags: ['blush', 'face', 'makeup', 'palette'],
    skinTypes: ['all'],
  },

  // ===== LIPS =====
  {
    name: 'Matte Lipstick', brand: 'Sugar Cosmetics', category: 'lips',
    description: 'Long-wearing matte lipstick that stays put for up to 12 hours. Creamy formula glides on smoothly and dries to a comfortable matte finish without drying lips.',
    ingredients: 'Ricinus Communis Seed Oil, Caprylic/Capric Triglyceride, Candelilla Cera, Tocopheryl Acetate, Iron Oxides',
    howToUse: 'Apply directly to lips or with a lip brush for precise application.',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600', 'https://images.unsplash.com/photo-1598803666444-9f56b5b296f8?w=600'],
    variants: [
      { label: 'Ruby Red', price: 449, originalPrice: 549, stock: 80 },
      { label: 'Nude Pink', price: 449, originalPrice: 549, stock: 95 },
      { label: 'Berry', price: 449, originalPrice: 549, stock: 70 },
      { label: 'Coral', price: 449, originalPrice: 549, stock: 65 },
    ],
    tags: ['lipstick', 'lips', 'makeup', 'matte'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Glossy Lip Oil', brand: 'NYX Professional', category: 'lips',
    description: 'Nourishing lip oil that delivers high-shine gloss while conditioning lips. Infused with jojoba oil and vitamin E for a comfortable, non-sticky wear.',
    ingredients: 'Ricinus Communis Seed Oil, Simmondsia Chinensis Seed Oil, Tocopheryl Acetate, Caprylic/Capric Triglyceride',
    howToUse: 'Apply directly with doe-foot applicator to bare or layered lips.',
    images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'],
    variants: [
      { label: 'Clear', price: 299, stock: 120 },
      { label: 'Rose', price: 299, stock: 100 },
      { label: 'Berry', price: 299, stock: 85 },
    ],
    tags: ['lip oil', 'lips', 'gloss', 'makeup', 'shine'],
    skinTypes: ['all'],
  },
  {
    name: 'Lip Liner Pencil', brand: 'Maybelline', category: 'lips',
    description: 'Creamy, long-lasting lip liner that defines and prevents feathering. The twist-up mechanism means no sharpening needed.',
    ingredients: 'Cyclopentasiloxane, Dimethicone, Polyethylene, Cera Alba, Tocopheryl Acetate, Iron Oxides',
    howToUse: 'Trace the natural lip line, then fill in for longer-lasting lip color.',
    images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'],
    variants: [
      { label: 'Nude', price: 199, stock: 150 },
      { label: 'Red', price: 199, stock: 110 },
      { label: 'Brown', price: 199, stock: 90 },
    ],
    tags: ['lip liner', 'lips', 'makeup', 'define'],
    skinTypes: ['all'],
  },
  {
    name: 'Tinted Lip Balm', brand: 'Burt\'s Bees', category: 'lips',
    description: '100% natural tinted lip balm that moisturizes and adds a hint of color. Made with beeswax, coconut oil, and sunflower oil for deep hydration.',
    ingredients: 'Ricinus Communis Seed Oil, Cocos Nucifera Oil, Cera Alba, Helianthus Annuus Seed Oil, Tocopherol, Iron Oxides',
    howToUse: 'Apply generously to lips as needed throughout the day.',
    images: ['https://images.unsplash.com/photo-1598803666444-9f56b5b296f8?w=600'],
    variants: [
      { label: 'Rose', price: 249, stock: 200 },
      { label: 'Hibiscus', price: 249, stock: 180 },
      { label: 'Pomegranate', price: 249, stock: 160 },
    ],
    tags: ['lip balm', 'lips', 'natural', 'tinted'],
    skinTypes: ['all'],
  },

  // ===== EYES =====
  {
    name: 'Eyeshadow Palette', brand: 'Lakme', category: 'eyes',
    description: '9-shade eyeshadow palette with a mix of matte, shimmer, and glitter finishes. Highly pigmented, blendable formulas for endless eye looks.',
    ingredients: 'Talc, Mica, Dimethicone, Nylon-12, Zinc Stearate, Iron Oxides, Tin Oxide',
    howToUse: 'Use lighter shades all over lid, medium shades in crease, and dark shades to define outer corner.',
    images: ['https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'],
    variants: [
      { label: 'Warm Neutrals', price: 799, originalPrice: 999, stock: 35 },
      { label: 'Cool Smokey', price: 799, originalPrice: 999, stock: 28 },
      { label: 'Rose Gold', price: 799, originalPrice: 999, stock: 42 },
    ],
    tags: ['eyeshadow', 'eyes', 'makeup', 'palette'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Waterproof Eyeliner', brand: 'Maybelline', category: 'eyes',
    description: 'Ultra-precise waterproof eyeliner pen with a fine tip for effortless application. Smudge-proof and stays on all day without fading.',
    ingredients: 'Aqua, Acrylates Copolymer, Butylene Glycol, Carbon Black, Polyvinyl Alcohol',
    howToUse: 'Starting from inner corner, draw a thin line along lash line, thickening as desired.',
    images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'],
    variants: [
      { label: 'Black', price: 349, stock: 100 },
      { label: 'Brown', price: 349, stock: 75 },
    ],
    tags: ['eyeliner', 'eyes', 'makeup', 'waterproof'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Volume & Curl Mascara', brand: 'L\'Oreal Paris', category: 'eyes',
    description: 'Volumizing mascara with a curved brush that lifts, curls, and separates lashes. Buildable formula for natural to dramatic lashes.',
    ingredients: 'Aqua, Cera Alba, Copernicia Cerifera Cera, Stearic Acid, Acacia Senegal Gum, Iron Oxides',
    howToUse: 'Wiggle wand from base to tip of lashes. Layer for more volume.',
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600'],
    variants: [
      { label: 'Black', price: 499, originalPrice: 599, stock: 88 },
      { label: 'Brown Black', price: 499, originalPrice: 599, stock: 60 },
    ],
    tags: ['mascara', 'eyes', 'makeup', 'volume', 'curl'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Eyebrow Definer', brand: 'Sugar Cosmetics', category: 'eyes',
    description: 'Ultra-fine mechanical eyebrow pencil for natural, hair-like strokes. The triangular tip allows for precision and easy filling.',
    ingredients: 'Cyclopentasiloxane, Dimethicone, Polyethylene, Cera Alba, Tocopheryl Acetate, Iron Oxides',
    howToUse: 'Use light, upward strokes to fill in sparse areas. Brush through with spoolie to blend.',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'],
    variants: [
      { label: 'Blonde', price: 299, stock: 120 },
      { label: 'Brown', price: 299, stock: 140 },
      { label: 'Dark Grey', price: 299, stock: 100 },
    ],
    tags: ['eyebrow', 'eyes', 'makeup', 'define'],
    skinTypes: ['all'],
  },
  {
    name: 'Eye Primer', brand: 'NYX Professional', category: 'eyes',
    description: 'Eyeshadow primer that intensifies color payoff and prevents creasing. Creates a smooth, even base for all eyeshadow formulas.',
    ingredients: 'Aqua, Cyclopentasiloxane, Dimethicone, Silica, Talc, Tocopheryl Acetate',
    howToUse: 'Apply a tiny amount to eyelids and blend before applying eyeshadow.',
    images: ['https://images.unsplash.com/photo-1631730359713-6b8f1c7bd7d2?w=600'],
    variants: [
      { label: 'Original', price: 399, stock: 65 },
    ],
    tags: ['eye primer', 'eyes', 'makeup', 'base'],
    skinTypes: ['all'],
  },

  // ===== SKIN CARE =====
  {
    name: 'Vitamin C Serum', brand: 'The Ordinary', category: 'skin',
    description: 'Concentrated vitamin C serum that brightens skin and reduces dark spots. Lightweight formula absorbs quickly for visible radiance.',
    ingredients: 'Ascorbic Acid, Propylene Glycol, Glycerin, Aqua, Tocopherol, Ferulic Acid',
    howToUse: 'Apply 3-4 drops to clean, dry skin in the morning before moisturizer.',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600'],
    variants: [
      { label: '30ml', price: 649, stock: 90 },
      { label: '50ml', price: 949, stock: 55 },
    ],
    tags: ['serum', 'skin', 'vitamin c', 'brightening'],
    skinTypes: ['normal', 'dry', 'combination'],
    isFeatured: true,
  },
  {
    name: 'Hydrating Moisturizer', brand: 'Cetaphil', category: 'skin',
    description: 'A dermatologist-recommended daily moisturizer that hydrates and soothes sensitive skin. Non-comedogenic, fragrance-free formula.',
    ingredients: 'Aqua, Glycerin, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Tocopheryl Acetate, Panthenol',
    howToUse: 'Apply generously to face and neck after cleansing, morning and night.',
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
    variants: [
      { label: '50ml', price: 499, stock: 120 },
      { label: '100ml', price: 799, stock: 80 },
    ],
    tags: ['moisturizer', 'skin', 'hydration', 'sensitive'],
    skinTypes: ['normal', 'dry', 'sensitive'],
    isFeatured: true,
  },
  {
    name: 'Salicylic Acid Face Wash', brand: 'Minimalist', category: 'skin',
    description: 'Gentle foaming face wash with 2% salicylic acid that deeply cleanses pores and prevents breakouts. Sulfate-free and PH-balanced.',
    ingredients: 'Aqua, Salicylic Acid, Cocamidopropyl Betaine, Glycerin, Niacinamide, Panthenol',
    howToUse: 'Use daily, morning and night. Massage onto wet face, rinse thoroughly.',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
    variants: [
      { label: '100ml', price: 349, stock: 150 },
      { label: '200ml', price: 549, stock: 100 },
    ],
    tags: ['face wash', 'skin', 'cleanser', 'acne', 'salicylic acid'],
    skinTypes: ['oily', 'combination'],
  },
  {
    name: 'SPF 50 Sunscreen', brand: 'Neutrogena', category: 'skin',
    description: 'Ultra-light sunscreen with SPF 50 and PA++++ protection. Non-greasy formula that dries clear with no white cast. Water-resistant.',
    ingredients: 'Aqua, Homosalate, Octocrylene, Ethylhexyl Salicylate, Butyl Methoxydibenzoylmethane, Tocopherol',
    howToUse: 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.',
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600'],
    variants: [
      { label: '50ml', price: 449, stock: 95 },
    ],
    tags: ['sunscreen', 'skin', 'spf', 'protection'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', category: 'skin',
    description: 'High-strength vitamin B3 formula that reduces sebum production, minimizes pores, and improves skin texture. Lightweight serum texture.',
    ingredients: 'Aqua, Niacinamide, Propylene Glycol, Zinc PCA, Glycerin, Xanthan Gum',
    howToUse: 'Apply a few drops to face after cleansing, before moisturizer.',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
    variants: [
      { label: '30ml', price: 449, stock: 110 },
      { label: '60ml', price: 749, stock: 65 },
    ],
    tags: ['serum', 'skin', 'niacinamide', 'pores', 'oil control'],
    skinTypes: ['oily', 'combination'],
  },
  {
    name: 'Under-Eye Cream', brand: 'L\'Oreal Paris', category: 'skin',
    description: 'Revitalizing eye cream with caffeine and hyaluronic acid that reduces puffiness, dark circles, and fine lines.',
    ingredients: 'Aqua, Glycerin, Caffeine, Sodium Hyaluronate, Tocopheryl Acetate, Panthenol',
    howToUse: 'Gently tap a small amount around the eye contour with ring finger.',
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600'],
    variants: [
      { label: '15ml', price: 549, stock: 70 },
    ],
    tags: ['eye cream', 'skin', 'under-eye', 'puffiness'],
    skinTypes: ['all'],
  },

  // ===== HAIR =====
  {
    name: 'Argan Oil Hair Serum', brand: 'Moroccanoil', category: 'hair',
    description: 'Lightweight hair serum infused with argan oil that tames frizz, adds shine, and protects against heat damage. Suitable for all hair types.',
    ingredients: 'Cyclomethicone, Dimethiconol, Argania Spinosa Kernel Oil, Linum Usitatissimum Seed Oil, Tocopheryl Acetate',
    howToUse: 'Apply 1-2 pumps to damp or dry hair, focusing on mid-lengths and ends.',
    images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'],
    variants: [
      { label: '50ml', price: 699, originalPrice: 849, stock: 60 },
      { label: '100ml', price: 999, originalPrice: 1199, stock: 35 },
    ],
    tags: ['hair', 'serum', 'argan oil', 'shine', 'frizz'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Sulfate-Free Shampoo', brand: 'Biotique', category: 'hair',
    description: 'Gentle, sulfate-free shampoo made with natural botanicals. Cleanses without stripping natural oils, leaving hair soft and manageable.',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Aloe Barbadensis Leaf Juice, Centella Asiatica Extract, Tocopherol',
    howToUse: 'Massage into wet hair, lather, and rinse thoroughly. Follow with conditioner.',
    images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'],
    variants: [
      { label: '200ml', price: 299, stock: 130 },
      { label: '400ml', price: 449, stock: 90 },
    ],
    tags: ['shampoo', 'hair', 'sulfate-free', 'natural'],
    skinTypes: ['all'],
  },
  {
    name: 'Hair Mask', brand: 'Plum', category: 'hair',
    description: 'Deep conditioning hair mask with shea butter and coconut oil. Repairs damaged hair and restores moisture for silky, smooth strands.',
    ingredients: 'Aqua, Cetearyl Alcohol, Butyrospermum Parkii Butter, Cocos Nucifera Oil, Hydrolyzed Keratin, Tocopherol',
    howToUse: 'Apply to clean, damp hair. Leave for 5-10 minutes, then rinse thoroughly.',
    images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600'],
    variants: [
      { label: '200g', price: 399, stock: 75 },
    ],
    tags: ['hair mask', 'hair', 'conditioning', 'repair'],
    skinTypes: ['all'],
  },

  // ===== BODY =====
  {
    name: 'Body Lotion', brand: 'Vaseline', category: 'body',
    description: 'Intensive body lotion with cocoa butter and vitamin E that deeply moisturizes and restores dry skin. Non-greasy formula absorbs quickly.',
    ingredients: 'Aqua, Glycerin, Stearic Acid, Glycol Stearate, Theobroma Cacao Seed Butter, Tocopheryl Acetate',
    howToUse: 'Apply all over body after shower, focusing on dry areas.',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
    variants: [
      { label: '200ml', price: 199, stock: 200 },
      { label: '400ml', price: 349, stock: 150 },
    ],
    tags: ['body', 'lotion', 'moisturizer', 'cocoa butter'],
    skinTypes: ['all'],
  },
  {
    name: 'Perfume Body Mist', brand: 'Plum', category: 'body',
    description: 'Long-lasting body mist with a captivating fragrance. Lightweight formula that keeps you smelling fresh all day. Vegan and cruelty-free.',
    ingredients: 'Alcohol Denat., Aqua, Parfum, Propylene Glycol, Tocopherol',
    howToUse: 'Spray on pulse points and body from a distance of 6 inches.',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'],
    variants: [
      { label: 'Vanilla Vibes', price: 299, stock: 110 },
      { label: 'Ocean Mist', price: 299, stock: 95 },
      { label: 'Rose Bloom', price: 299, stock: 85 },
    ],
    tags: ['body mist', 'body', 'fragrance', 'perfume'],
    skinTypes: ['all'],
  },
  {
    name: 'Coffee Body Scrub', brand: 'Mcaffeine', category: 'body',
    description: 'Energizing body scrub with real coffee beans and coconut oil that exfoliates and smooths skin. Stimulates circulation for firmer-looking skin.',
    ingredients: 'Coffea Arabica Seed Powder, Cocos Nucifera Oil, Glycerin, Aqua, Tocopherol',
    howToUse: 'Massage onto damp skin in circular motions, rinse thoroughly.',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
    variants: [
      { label: '200g', price: 349, stock: 60 },
    ],
    tags: ['body scrub', 'body', 'exfoliator', 'coffee'],
    skinTypes: ['all'],
  },

  // ===== TOOLS =====
  {
    name: 'Makeup Brush Set', brand: 'Sugar Cosmetics', category: 'tools',
    description: 'Complete set of 10 professional makeup brushes. Includes foundation, powder, blush, eyeshadow, blending, and lip brushes. Soft synthetic bristles.',
    ingredients: 'Synthetic Taklon bristles, Aluminum ferrules, Wooden handles',
    howToUse: 'Use each brush for its intended purpose. Clean regularly with mild soap.',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'],
    variants: [
      { label: '10-Piece Set', price: 999, originalPrice: 1499, stock: 25 },
    ],
    tags: ['brushes', 'tools', 'makeup', 'set'],
    skinTypes: ['all'],
    isFeatured: true,
  },
  {
    name: 'Beauty Blender Sponge', brand: 'Wet n Wild', category: 'tools',
    description: 'Ultra-soft, latex-free makeup sponge for seamless foundation and concealer application. Expands when wet for a streak-free finish.',
    ingredients: 'Polyurethane foam',
    howToUse: 'Dampen sponge, squeeze excess water, and bounce onto skin to blend makeup.',
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600'],
    variants: [
      { label: 'Single', price: 149, stock: 200 },
      { label: '3-Pack', price: 349, stock: 100 },
    ],
    tags: ['sponge', 'tools', 'blender', 'makeup'],
    skinTypes: ['all'],
  },
  {
    name: 'Eyelash Curler', brand: 'L\'Oreal Paris', category: 'tools',
    description: 'Ergonomic eyelash curler with a comfortable grip that gives lashes a natural, long-lasting curl. Silicone pad protects lashes.',
    ingredients: 'Stainless steel, Silicone pad, Rubber handle',
    howToUse: 'Position at base of lashes, gently squeeze and hold for 5 seconds.',
    images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'],
    variants: [
      { label: 'Standard', price: 249, stock: 80 },
    ],
    tags: ['eyelash curler', 'tools', 'lashes'],
    skinTypes: ['all'],
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`${products.length} products seeded successfully`);
  await mongoose.disconnect();
};

seed().catch(e => { console.error(e); process.exit(1); });
