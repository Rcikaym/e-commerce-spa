import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          MONO CRAFT
        </Link>
        <nav className="navbar__nav">
          <Link to="/search" className="navbar__link">
            Shop
          </Link>
          <Link to="/cart" className="navbar__link" aria-label={`Cart with ${cartCount} items`}>
            Cart
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
