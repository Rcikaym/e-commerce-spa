import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductsByCategory } from '../api/products';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import ImagePlaceholder from '../components/UI/ImagePlaceholder';
import Button from '../components/UI/Button';
import ProductCard from '../components/Product/ProductCard';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch product detail
  const fetchProduct = useCallback(() => getProductById(id), [id]);
  const { data: product, isLoading: isProductLoading, error: productError } = useProducts(fetchProduct);

  // Reset quantity and confirmation when product changes
  useEffect(() => {
    setQuantity(1);
    setShowConfirmation(false);
  }, [id]);

  // Fetch related products
  const category = product?.category || '';
  const fetchRelated = useCallback(() => getProductsByCategory(category), [category]);
  const { data: relatedProducts } = useProducts(fetchRelated, null, !!category);

  // Filter out the current product from related products and limit to 4
  const filteredRelated = useMemo(() => {
    if (!relatedProducts || !product) return [];
    return relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);
  }, [relatedProducts, product]);

  const handleAddToCart = () => {
    if (!product) return;
    const existing = cartItems.find((item) => item.productId === product.id);

    if (!existing) {
      addToCart(product);
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    } else {
      updateQuantity(product.id, Math.min(existing.quantity + quantity, product.stock));
    }

    setShowConfirmation(true);
  };

  // Auto-hide confirmation message
  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => setShowConfirmation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  if (isProductLoading) {
    return (
      <div className="product-detail__loading">
        <p className="product-detail__loading-text">Loading product details...</p>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="product-detail__error">
        <p className="product-detail__error-text">
          {productError || 'Product not found'}
        </p>
        <Link to="/search" style={{ marginTop: '16px', display: 'inline-block' }}>
          <Button variant="ghost">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const { name, price, stock, description } = product;
  const isOutOfStock = stock <= 0;

  const formattedPrice = `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

  return (
    <div className="product-detail">
      <nav aria-label="Breadcrumb">
        <ol className="product-detail__breadcrumb">
          <li>
            <Link to="/" className="product-detail__breadcrumb-link">
              Home
            </Link>
          </li>
          <li className="product-detail__breadcrumb-separator">›</li>
          <li>
            <Link
              to={`/search?category=${category}`}
              className="product-detail__breadcrumb-link"
            >
              {category}
            </Link>
          </li>
          <li className="product-detail__breadcrumb-separator">›</li>
          <li className="product-detail__breadcrumb-current" aria-current="page">
            {name}
          </li>
        </ol>
      </nav>

      <div className="product-detail__main">
        <div className="product-detail__image">
          <ImagePlaceholder category={category} size="large" />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__category">{category}</span>
          <h1 className="product-detail__name">{name}</h1>
          <p className="product-detail__price">{formattedPrice}</p>

          <p className="product-detail__stock">
            {isOutOfStock ? (
              <span className="product-detail__stock--out">Out of Stock</span>
            ) : (
              <span className="product-detail__stock--available">
                In Stock ({stock} available)
              </span>
            )}
          </p>

          <p className="product-detail__description">{description}</p>

          {!isOutOfStock && (
            <div className="product-detail__quantity">
              <span className="product-detail__quantity-label">Quantity</span>
              <div className="product-detail__stepper">
                <button
                  className="product-detail__stepper-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="product-detail__stepper-value">{quantity}</span>
                <button
                  className="product-detail__stepper-btn"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="product-detail__add-to-cart"
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </Button>

          {showConfirmation && (
            <p className="product-detail__confirmation" role="status">
              Added to cart
            </p>
          )}
        </div>
      </div>

      {filteredRelated.length > 0 && (
        <section className="product-detail__related">
          <h2 className="product-detail__related-heading">From the same collection</h2>
          <div className="product-detail__related-scroll">
            {filteredRelated.map((relatedProduct) => (
              <div key={relatedProduct.id} className="product-detail__related-item">
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
