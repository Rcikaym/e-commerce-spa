import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/Cart/CartItem';
import Button from '../components/UI/Button';
import './CartPage.css';

const CartPage = () => {
  const {
    cartItems,
    cartTotal,
    shippingCost,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const formattedSubtotal = `Rp ${new Intl.NumberFormat('id-ID').format(subtotal)}`;
  const formattedShipping = shippingCost === 0
    ? 'Free'
    : `Rp ${new Intl.NumberFormat('id-ID').format(shippingCost)}`;
  const formattedTotal = `Rp ${new Intl.NumberFormat('id-ID').format(cartTotal)}`;

  const isEmpty = cartItems.length === 0;

  return (
    <div className="cart-page">
      <h1 className="cart-page__heading">Cart</h1>

      {isEmpty ? (
        <div className="cart-page__empty">
          <h2 className="cart-page__empty-heading">Your cart is empty</h2>
          <p className="cart-page__empty-text">
            <Link to="/search" className="cart-page__empty-link">
              Start exploring our collection
            </Link>
          </p>
        </div>
      ) : (
        <div className="cart-page__layout">
          <div className="cart-page__items">
            {cartItems.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="cart-page__summary">
            <h2 className="cart-page__summary-heading">Order Summary</h2>

            <div className="cart-page__summary-row">
              <span className="cart-page__summary-label">Subtotal</span>
              <span className="cart-page__summary-value">{formattedSubtotal}</span>
            </div>

            <div className="cart-page__summary-row">
              <span className="cart-page__summary-label">Shipping</span>
              <span className="cart-page__summary-value">{formattedShipping}</span>
            </div>

            <hr className="cart-page__summary-divider" />

            <div className="cart-page__summary-row cart-page__summary-total">
              <span className="cart-page__summary-label">Total</span>
              <span className="cart-page__summary-value">{formattedTotal}</span>
            </div>

            {subtotal < 500000 && (
              <p className="cart-page__shipping-note">
                Spend another Rp {new Intl.NumberFormat('id-ID').format(500000 - subtotal)} for free shipping.
              </p>
            )}

            <div className="cart-page__actions">
              <Link to="/checkout" className="cart-page__checkout-btn-link">
                <Button variant="primary" style={{ width: '100%' }}>
                  Checkout
                </Button>
              </Link>
              <Link to="/search" className="cart-page__continue-btn-link">
                <Button variant="ghost" style={{ width: '100%' }}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
