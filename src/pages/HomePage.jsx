import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../api/products';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/Product/ProductGrid';
import Button from '../components/UI/Button';
import './HomePage.css';

const HomePage = () => {
  const { data: featuredProducts, isLoading, error } = useProducts(getFeaturedProducts);

  const categories = ['Ceramics', 'Textiles', 'Stationery', 'Lighting'];

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-hero__headline">Objects for Quiet Living</h1>
        <p className="home-hero__subheading">
          Handcrafted Japanese homeware, chosen with intention.
        </p>
        <Link to="/search">
          <Button variant="primary" className="home-hero__cta-btn">
            Explore Collection
          </Button>
        </Link>
      </section>

      <section className="home-featured">
        <h2 className="home-featured__heading">Selected Pieces</h2>
        {error ? (
          <p className="home-error-message">{error}</p>
        ) : (
          <ProductGrid
            products={featuredProducts || []}
            isLoading={isLoading}
            skeletonCount={8}
          />
        )}
      </section>

      <section className="home-categories">
        <ul className="home-categories__list">
          {categories.map((category) => (
            <li key={category}>
              <Link to={`/search?category=${category}`} className="home-categories__link">
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
