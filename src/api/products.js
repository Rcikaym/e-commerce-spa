import { products } from '../data/products';

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 150) + 250),
  );

export const getProducts = async () => {
  await delay();
  return [...products];
};

export const getProductById = async (id) => {
  await delay();
  const product = products.find((p) => p.id === id);
  if (!product) {
    throw new Error(`Product with id "${id}" not found`);
  }
  return { ...product };
};

export const searchProducts = async ({
  query = '',
  category = '',
  sortBy = '',
  minPrice = 0,
  maxPrice = Infinity,
} = {}) => {
  await delay();

  let results = [...products];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  results = results.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice,
  );

  switch (sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      results.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return results;
};

export const getProductsByCategory = async (category) => {
  await delay();
  return products
    .filter((p) => p.category === category)
    .map((p) => ({ ...p }));
};

export const getFeaturedProducts = async () => {
  await delay();
  return products
    .filter((p) => p.featured)
    .map((p) => ({ ...p }));
};
