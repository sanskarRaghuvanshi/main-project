export const categories = [
  { label: 'Face', value: 'face' },
  { label: 'Lips', value: 'lips' },
  { label: 'Eyes', value: 'eyes' },
  { label: 'Skin', value: 'skin' },
  { label: 'Hair', value: 'hair' },
  { label: 'Body', value: 'body' },
  { label: 'Tools', value: 'tools' },
];

export const sortOptions = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
];

export const skinTypes = ['oily', 'dry', 'combination', 'normal', 'sensitive'];

export const concerns = ['Acne', 'Dark Spots', 'Dullness', 'Pores', 'Wrinkles', 'Hydration', 'Sensitivity', 'Oiliness'];

export const goals = ['Clear Skin', 'Anti-aging', 'Even Tone', 'Hydration Boost', 'Oil Control', 'Brightening'];

export const budgets = [
  { label: 'Budget-friendly', value: 'low', desc: 'Under ₹500' },
  { label: 'Mid-range', value: 'medium', desc: '₹500 - ₹1500' },
  { label: 'Premium', value: 'high', desc: '₹1500+' },
  { label: 'No limit', value: 'any', desc: 'Show all' },
];

export const orderStatuses = ['pending', 'confirmed', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled'];

export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  dispatched: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
