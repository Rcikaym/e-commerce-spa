import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ImagePlaceholder from '../UI/ImagePlaceholder';
import './ProductCard.css';

const formatPrice = (price) =>
  `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

const ProductCard = ({ product }) => {
  const { id, name, category, price, stock } = product;
  const isOutOfStock = stock <= 0;

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-card__link">
        <ImagePlaceholder category={category} size="large" />
        <div className="product-card__body">
          <p className="product-card__category">{category}</p>
          <p className="product-card__name">{name}</p>
          <p className="product-card__price">{formatPrice(price)}</p>
          <p
            className={`product-card__stock${isOutOfStock ? ' product-card__stock--out' : ''}`}
          >
            {isOutOfStock ? 'Out of Stock' : `${stock} in stock`}
          </p>
        </div>
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.oneOf(['Ceramics', 'Textiles', 'Stationery', 'Lighting'])
      .isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
