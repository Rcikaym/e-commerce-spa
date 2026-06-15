import {
  createContext,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 25000;

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id,
      );

      if (existingIndex !== -1) {
        const updated = state.items.map((item, index) => {
          if (index !== existingIndex) return item;
          const newQty = Math.min(item.quantity + 1, product.stock);
          return { ...item, quantity: newQty };
        });
        return { ...state, items: updated };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            quantity: 1,
          },
        ],
      };
    }

    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== productId),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.productId !== productId) return item;
          const clampedQty = Math.max(1, Math.min(quantity, item.stock));
          return { ...item, quantity: clampedQty };
        }),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};

const initialState = { items: [] };

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingCost =
      subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0
        ? 0
        : SHIPPING_COST;
    const cartTotal = subtotal + shippingCost;
    const cartCount = state.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return {
      cartItems: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      shippingCost,
    };
  }, [state.items]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
