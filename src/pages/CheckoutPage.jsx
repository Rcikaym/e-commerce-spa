import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, shippingCost, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Redirect to cart if cart is empty, unless we just completed a checkout (success state)
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isSuccess]);

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'phone') {
      const phoneRegex = /^\+?[0-9\s-]{10,}$/;
      if (!phoneRegex.test(value)) {
        error = 'Please enter a valid phone number';
      }
    } else if (name === 'cardNumber') {
      const cardDigits = value.replace(/[-\s]/g, '');
      if (!/^\d{16}$/.test(cardDigits)) {
        error = 'Please enter a valid 16-digit card number';
      }
    } else if (name === 'cvv') {
      if (!/^\d{3,4}$/.test(value.trim())) {
        error = 'CVV must be 3 or 4 digits';
      }
    } else if (name === 'expiryDate') {
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value.trim())) {
        error = 'Format must be MM/YY';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setOrderNumber(`MC-2026-${randomNum}`);
      clearCart();
    }, 1500);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const formattedSubtotal = `Rp ${new Intl.NumberFormat('id-ID').format(subtotal)}`;
  const formattedShipping = shippingCost === 0
    ? 'Free'
    : `Rp ${new Intl.NumberFormat('id-ID').format(shippingCost)}`;
  const formattedTotal = `Rp ${new Intl.NumberFormat('id-ID').format(cartTotal)}`;

  if (isSuccess) {
    return (
      <div className="checkout-page__success">
        <h1 className="checkout-page__success-heading">Thank You</h1>
        <p className="checkout-page__success-order">Order Number: {orderNumber}</p>
        <p className="checkout-page__success-message">
          Your order has been placed successfully. A confirmation email will be sent
          shortly with shipping details.
        </p>
        <Link to="/search" className="checkout-page__success-link-wrapper">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__heading">Checkout</h1>

      <form className="checkout-page__layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-page__form">
          <section className="checkout-page__section">
            <h2 className="checkout-page__section-title">Shipping Information</h2>

            <div className="checkout-page__field">
              <Input
                label="Full Name"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.fullName}
              />
            </div>

            <div className="checkout-page__field-row">
              <div className="checkout-page__field">
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                />
              </div>
              <div className="checkout-page__field">
                <Input
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="e.g. 081234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                />
              </div>
            </div>

            <div className="checkout-page__field">
              <Input
                label="Address"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.address}
              />
            </div>

            <div className="checkout-page__field-row">
              <div className="checkout-page__field">
                <Input
                  label="City"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.city}
                />
              </div>
              <div className="checkout-page__field">
                <Input
                  label="Postal Code"
                  id="postalCode"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.postalCode}
                />
              </div>
            </div>
          </section>

          <section className="checkout-page__section">
            <h2 className="checkout-page__section-title">Payment</h2>
            <p className="checkout-page__demo-note">
              Demo Mode — Please do not enter real payment credentials.
            </p>

            <div className="checkout-page__field">
              <Input
                label="Card Number"
                id="cardNumber"
                name="cardNumber"
                required
                placeholder="4111 2222 3333 4444"
                value={formData.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.cardNumber}
              />
            </div>

            <div className="checkout-page__field-row">
              <div className="checkout-page__field">
                <Input
                  label="Expiry Date"
                  id="expiryDate"
                  name="expiryDate"
                  required
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.expiryDate}
                />
              </div>
              <div className="checkout-page__field">
                <Input
                  label="CVV"
                  id="cvv"
                  name="cvv"
                  type="password"
                  required
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.cvv}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="checkout-page__summary">
          <h2 className="checkout-page__summary-heading">Order Summary</h2>

          <div className="checkout-page__summary-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="checkout-page__summary-item">
                <span className="checkout-page__summary-item-name">
                  {item.name}
                  <span className="checkout-page__summary-item-qty">
                    × {item.quantity}
                  </span>
                </span>
                <span className="checkout-page__summary-item-price">
                  Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <hr className="checkout-page__summary-divider" />

          <div className="checkout-page__summary-row">
            <span className="checkout-page__summary-label">Subtotal</span>
            <span className="checkout-page__summary-value">{formattedSubtotal}</span>
          </div>

          <div className="checkout-page__summary-row">
            <span className="checkout-page__summary-label">Shipping</span>
            <span className="checkout-page__summary-value">{formattedShipping}</span>
          </div>

          <hr className="checkout-page__summary-divider" />

          <div className="checkout-page__summary-row checkout-page__summary-total">
            <span className="checkout-page__summary-label">Total</span>
            <span className="checkout-page__summary-value">{formattedTotal}</span>
          </div>

          <button
            type="submit"
            className="checkout-page__submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Pay ${formattedTotal}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
