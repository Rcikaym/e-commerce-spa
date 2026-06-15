import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import SkeletonCard from '../Skeleton/SkeletonCard';
import './ProductGrid.css';

const ProductGrid = ({ products, isLoading = false, skeletonCount = 8 }) => {
  return (
    <div className="product-grid">
      {isLoading
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <SkeletonCard key={i} />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.oneOf(['Ceramics', 'Textiles', 'Stationery', 'Lighting'])
        .isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    }),
  ),
  isLoading: PropTypes.bool,
  skeletonCount: PropTypes.number,
};

export default ProductGrid;
