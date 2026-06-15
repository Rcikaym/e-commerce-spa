import PropTypes from 'prop-types';
import ImagePlaceholder from '../UI/ImagePlaceholder';
import './CartItem.css';

const getCategoryFromId = (id) => {
  if (id.startsWith('cer-')) return 'Ceramics';
  if (id.startsWith('tex-')) return 'Textiles';
  if (id.startsWith('sta-')) return 'Stationery';
  if (id.startsWith('lit-')) return 'Lighting';
  return 'Ceramics';
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { productId, name, price, stock, quantity } = item;
  const category = getCategoryFromId(productId);
  const lineTotal = price * quantity;

  const formattedPrice = `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
  const formattedTotal = `Rp ${new Intl.NumberFormat('id-ID').format(lineTotal)}`;

  return (
    <div className="cart-item">
      <ImagePlaceholder category={category} size="small" className="cart-item__image" />
      <div className="cart-item__info">
        <h3 className="cart-item__name">{name}</h3>
        <p className="cart-item__price">{formattedPrice}</p>
      </div>
      <div className="cart-item__controls">
        <button
          className="cart-item__qty-btn"
          onClick={() => onUpdateQuantity(productId, quantity - 1)}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="cart-item__qty">{quantity}</span>
        <button
          className="cart-item__qty-btn"
          onClick={() => onUpdateQuantity(productId, quantity + 1)}
          disabled={quantity >= stock}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="cart-item__total">{formattedTotal}</div>
      <button
        className="cart-item__remove"
        onClick={() => onRemove(productId)}
        aria-label={`Remove ${name} from cart`}
      >
        ×
      </button>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
