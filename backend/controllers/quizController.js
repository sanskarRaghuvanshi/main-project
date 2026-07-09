import Product from '../models/Product.js';

export const recommend = async (req, res) => {
  try {
    const { skinType, concerns, goals, budget } = req.body;
    if (!process.env.ANTHROPIC_API_KEY) {
      const products = await Product.find({
        skinTypes: { $in: [skinType, 'all'] },
        ...(budget && budget !== 'any' && { 'variants.price': budget === 'low' ? { $lte: 500 } : budget === 'medium' ? { $gte: 500, $lte: 1500 } : { $gte: 1500 } }),
      }).limit(6);
      return res.json({ success: true, data: products.map(p => ({ product: p, matchScore: 85, reason: 'Perfect match for your skin profile' })) });
    }
    const allProducts = await Product.find({ isActive: true }).limit(50);
    const list = allProducts.map(p => ({ id: p._id.toString(), name: p.name, brand: p.brand, category: p.category, price: p.variants?.[0]?.price || 0, skinTypes: p.skinTypes }));
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', max_tokens: 1024,
        messages: [{ role: 'user', content: `You are a beauty advisor. Skin: ${skinType}, Concerns: ${concerns?.join(', ')}, Goals: ${goals?.join(', ')}, Budget: ${budget}. Recommend 4-6 from: ${JSON.stringify(list)}. Return JSON array with productId, matchScore (0-100), reason.` }],
      }),
    });
    const data = await response.json();
    let recommendations;
    try { recommendations = JSON.parse(data.content[0].text); } catch { recommendations = JSON.parse(data.content[0].text.match(/\[[\s\S]*\]/)[0]); }
    const ids = recommendations.map(r => r.productId);
    const products = await Product.find({ _id: { $in: ids } });
    const map = {}; products.forEach(p => map[p._id.toString()] = p);
    const result = recommendations.filter(r => map[r.productId]).map(r => ({ product: map[r.productId], matchScore: r.matchScore, reason: r.reason }));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
