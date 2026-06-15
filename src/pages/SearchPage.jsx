import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../api/products';
import { useProducts, useDebounce } from '../hooks/useProducts';
import ProductGrid from '../components/Product/ProductGrid';
import Button from '../components/UI/Button';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  // Local state for search input text
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Sync local input with URL param changes (e.g. back navigation)
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  // Sync debounced search to URL
  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    if (debouncedQuery) {
      currentParams.q = debouncedQuery;
    } else {
      delete currentParams.q;
    }
    setSearchParams(currentParams);
  }, [debouncedQuery]);

  // Update filters in URL helper
  const updateParam = (key, value) => {
    const currentParams = Object.fromEntries([...searchParams]);
    if (value) {
      currentParams[key] = value;
    } else {
      delete currentParams[key];
    }
    setSearchParams(currentParams);
  };

  const apiParams = useMemo(() => ({
    query: queryParam,
    category: categoryParam,
    sortBy: sortParam,
    minPrice: minPriceParam ? Number(minPriceParam) : 0,
    maxPrice: maxPriceParam ? Number(maxPriceParam) : Infinity,
  }), [queryParam, categoryParam, sortParam, minPriceParam, maxPriceParam]);

  const { data: products, isLoading, error } = useProducts(searchProducts, apiParams);

  const categories = ['Ceramics', 'Textiles', 'Stationery', 'Lighting'];

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="search-page">
      <div className="search-page__input-wrapper">
        <label htmlFor="search-input" className="visually-hidden">
          Search collection
        </label>
        <input
          id="search-input"
          type="text"
          className="search-page__input"
          placeholder="Search our collection..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="search-page__filters">
        <div className="search-page__filter-group">
          <span className="search-page__filter-label">Category</span>
          <div className="search-page__radio-group">
            <label className="search-page__radio-label">
              <input
                type="radio"
                name="category"
                checked={categoryParam === ''}
                onChange={() => updateParam('category', '')}
              />
              All
            </label>
            {categories.map((cat) => (
              <label key={cat} className="search-page__radio-label">
                <input
                  type="radio"
                  name="category"
                  checked={categoryParam === cat}
                  onChange={() => updateParam('category', cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="search-page__filter-group">
          <span className="search-page__filter-label">Price Range (IDR)</span>
          <div className="search-page__price-inputs">
            <input
              type="number"
              className="search-page__price-input"
              placeholder="Min"
              aria-label="Minimum price"
              value={minPriceParam}
              onChange={(e) => updateParam('minPrice', e.target.value)}
            />
            <span className="search-page__price-separator">-</span>
            <input
              type="number"
              className="search-page__price-input"
              placeholder="Max"
              aria-label="Maximum price"
              value={maxPriceParam}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div className="search-page__filter-group">
          <label htmlFor="sort-select" className="search-page__filter-label">
            Sort
          </label>
          <select
            id="sort-select"
            className="search-page__sort-select"
            value={sortParam}
            onChange={(e) => updateParam('sort', e.target.value)}
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      {error && <p className="home-error-message">{error}</p>}

      {!isLoading && !error && products && products.length === 0 && (
        <div className="search-page__empty">
          <h2 className="search-page__empty-heading">No products found</h2>
          <p className="search-page__empty-text">
            Try adjusting your search or filters.
          </p>
          <Button variant="ghost" onClick={handleClearFilters} className="search-page__clear-btn">
            Clear all filters
          </Button>
        </div>
      )}

      {!isLoading && !error && products && products.length > 0 && (
        <div className="search-page__results-count">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </div>
      )}

      {(isLoading || (!error && products && products.length > 0)) && (
        <ProductGrid
          products={products || []}
          isLoading={isLoading}
          skeletonCount={8}
        />
      )}
    </div>
  );
};

export default SearchPage;
