import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Blog from '../backend/models/Blog.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', 'api', '.env') });

const blogs = [
  {
    title: 'Your Complete Skincare Routine for Glowing Skin',
    slug: 'skincare-routine-glowing-skin',
    coverImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800',
    content: `Achieving glowing skin doesn't have to be complicated. The key is consistency and choosing the right products for your skin type.

Step 1: Cleanse — Start with a gentle cleanser that removes impurities without stripping your skin's natural barrier. For oily skin, try a salicylic acid-based cleanser like our Salicylic Acid Face Wash.

Step 2: Tone — A good toner balances your skin's pH and prepares it for the next steps. Look for alcohol-free formulas with soothing ingredients like rose water or niacinamide.

Step 3: Treat — This is where serums come in. Vitamin C serum in the morning brightens and protects, while retinol at night boosts collagen and cell turnover.

Step 4: Moisturize — Never skip moisturizer, even if you have oily skin. A lightweight gel moisturizer works well for oily types, while richer creams suit dry skin.

Step 5: Protect — SPF 50 sunscreen every morning is non-negotiable. It prevents premature aging, dark spots, and skin cancer.

Pro tip: Introduce one new product at a time and patch test first. Your skin needs 2-4 weeks to adjust to new active ingredients.`,
    excerpt: 'Discover the ultimate 5-step skincare routine for achieving radiant, glowing skin. From cleansing to SPF, we cover everything you need.',
    tags: ['skincare', 'routine', 'glowing skin', 'tips'],
    author: { name: 'Opal Beauty Team' },
    isPublished: true,
    publishedAt: new Date('2026-01-15'),
  },
  {
    title: 'How to Find Your Perfect Foundation Shade Online',
    slug: 'perfect-foundation-shade-online',
    coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    content: `Finding the right foundation shade without swatching in person can be tricky. Here's how to get it right every time.

1. Know Your Undertone — Your undertone is either warm (yellow/golden), cool (pink/blue), or neutral (a mix). Check the veins on your wrist: green means warm, blue means cool, both means neutral.

2. Use the Jawline Test — The perfect shade disappears into your jawline without being too light or too dark. This area matches both your face and neck.

3. Consider Your Seasonal Changes — Your skin lightens in winter and darkens in summer. Many brands offer multiple shades within a range to accommodate this.

4. Read Reviews with Photos — Look for reviews from people with similar skin tones. Photos in natural light are most helpful.

5. Start with Sample Sizes — When trying a new formula, get a smaller size first. Test it for a full day to check for oxidation (when the shade darkens after application).

Our Luminous Foundation comes in 3 shades — Ivory for fair skin, Sand for medium, and Tan for deeper tones. Each shade works across multiple undertones.`,
    excerpt: 'Struggling to match foundation shades online? Our guide breaks down undertones, seasonal changes, and pro tips for a flawless match.',
    tags: ['foundation', 'makeup', 'shade matching', 'tips'],
    author: { name: 'Opal Beauty Team' },
    isPublished: true,
    publishedAt: new Date('2026-02-01'),
  },
  {
    title: 'The Ultimate Guide to Lip Products: Which One Is Right for You?',
    slug: 'lip-products-guide',
    coverImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
    content: `From matte lipsticks to glossy oils, the world of lip products can be overwhelming. Here's a breakdown of every type and when to use it.

Matte Lipstick — Perfect for long days when you need your color to last. Modern mattes are comfortable and non-drying. Great for work, events, and evenings.

Liquid Lipstick — Intense pigment that dries down completely. Best for special occasions where you want bold, transfer-proof color.

Lip Gloss — High-shine finish that makes lips look fuller. Ideal for adding dimension over lipstick or wearing alone for a casual, fresh look.

Lip Oil — The new generation of lip care. Combines the shine of gloss with the nourishment of oil. Perfect for everyday wear and dry lips.

Tinted Lip Balm — Your best friend for low-maintenance days. Adds a wash of color while deeply hydrating. Great for the gym, errands, or no-makeup days.

Lip Liner — Not just for preventing feathering! Fill in your entire lip with liner before applying lipstick for a base that lasts twice as long.

Pro tip: Exfoliate with our Lip Scrub once a week for smooth, product-ready lips. Follow with a Lip Mask overnight for deep hydration.`,
    excerpt: 'Matte, gloss, oil, or balm? We break down every type of lip product so you can pick the perfect one for any occasion.',
    tags: ['lips', 'lipstick', 'gloss', 'makeup guide'],
    author: { name: 'Opal Beauty Team' },
    isPublished: true,
    publishedAt: new Date('2026-02-20'),
  },
  {
    title: 'Hair Care 101: Building a Routine for Healthy, Shiny Hair',
    slug: 'hair-care-routine-healthy-shiny',
    coverImage: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800',
    content: `Great hair starts with a great routine. Here's how to build one that works for your hair type.

Step 1: Choose the Right Shampoo — Sulfate-free shampoos are gentler and help maintain your hair's natural moisture. For color-treated hair, try our Purple Shampoo to keep brassiness away.

Step 2: Condition Correctly — Apply conditioner from mid-lengths to ends only (not the roots). Leave it on for 2-3 minutes for maximum absorption.

Step 3: Treat Weekly — A deep conditioning hair mask once a week can transform dry, damaged hair. Our Hair Mask with shea butter and coconut oil is packed with nutrients.

Step 4: Protect from Heat — Always use a heat protectant before blow-drying, curling, or straightening. Our Heat Protectant Spray shields up to 230°C.

Step 5: Oil Your Ends — A lightweight hair oil like our Argan Oil Serum seals moisture and prevents split ends. Just one pump is enough.

Bonus tip: Sleep on a silk pillowcase to reduce friction and prevent breakage. Your hairstyle will also last longer between washes.`,
    excerpt: 'Build the perfect hair care routine from shampoo to styling. Tips for cleansing, conditioning, treating, and protecting every hair type.',
    tags: ['hair care', 'routine', 'healthy hair', 'shine'],
    author: { name: 'Opal Beauty Team' },
    isPublished: true,
    publishedAt: new Date('2026-03-05'),
  },
  {
    title: 'Eye Makeup Looks for Every Occasion',
    slug: 'eye-makeup-looks-every-occasion',
    coverImage: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800',
    content: `Whether you're heading to the office or a night out, your eye makeup can set the tone. Here are three versatile looks.

The Everyday Natural Look — Start with an Eye Primer for all-day wear. Sweep a neutral shade like Champagne from our Eye Shadow Stick across the lid. Line upper lash line with our Waterproof Eyeliner in Brown for a softer effect. Finish with one coat of Volume & Curl Mascara.

The Glam Evening Look — Go for a smoky eye using darker shades. Apply a medium shade in the crease and a dark shade along the lash line. Add false lashes for drama. Line the waterline with our Kajal Pencil in Black for intensity.

The Fresh Daytime Look — Use bright, shimmery shades on the lid and a highlight in the inner corner to open up the eyes. Curl lashes with our Eyelash Curler and apply a lengthening mascara. Skip eyeliner for a softer, more youthful appearance.

Pro tip: The right eyebrow frame can transform your entire face. Use our Eyebrow Definer with light, hair-like strokes for natural-looking brows that complement any eye look.`,
    excerpt: 'Three stunning eye makeup looks for work, evenings, and weekends. Step-by-step guides using our favorite eye products.',
    tags: ['eye makeup', 'eyeshadow', 'tutorial', 'looks'],
    author: { name: 'Opal Beauty Team' },
    isPublished: true,
    publishedAt: new Date('2026-03-18'),
  },
  {
    title: 'Body Care Essentials: Don\'t Forget Below the Neck',
    slug: 'body-care-essentials',
    coverImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
    content: `Your skincare routine shouldn't stop at your chin. Here's how to give your body the same love and attention you give your face.

Exfoliate Weekly — Dead skin buildup happens everywhere, not just on your face. Use our Coffee Body Scrub twice a week in the shower for smoother, brighter skin. The caffeine stimulates circulation, which can help with cellulite appearance.

Moisturize Daily — Apply body lotion or body butter immediately after showering when your skin is still slightly damp. This locks in maximum hydration. Our Body Lotion with cocoa butter is perfect for daily use, while the Body Butter is ideal for very dry areas.

Protect Your Hands — Hand cream should be a staple in your bag, at your desk, and by your bedside. Frequent hand washing strips natural oils, so reapply after every wash.

Care for Your Feet — Our Foot Cream with peppermint and tea tree is a game-changer for tired feet. Apply it before bed and wear cotton socks overnight for soft, refreshed feet in the morning.

Freshen Up Naturally — Switch to an aluminum-free deodorant for a more natural approach to staying fresh. Our Deodorant Spray in Vanilla or Citrus keeps you confident all day.

Treat Yourself — A self-massage with our Ayurvedic Massage Oil not only nourishes skin but relieves muscle tension and improves sleep quality. Take 5 minutes after your shower to massage arms, legs, and shoulders.`,
    excerpt: 'Complete body care guide from head to toe. Exfoliation, moisturization, hand care, foot care, and self-care rituals for radiant skin.',
    tags: ['body care', 'skincare', 'self-care', 'body'],
    author: { name: 'Opal Beauty Team' },
    isPublished: true,
    publishedAt: new Date('2026-04-01'),
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  await Blog.deleteMany({});
  await Blog.insertMany(blogs);
  console.log(`${blogs.length} blogs seeded successfully`);
  await mongoose.disconnect();
};

seed().catch(e => { console.error(e); process.exit(1); });
