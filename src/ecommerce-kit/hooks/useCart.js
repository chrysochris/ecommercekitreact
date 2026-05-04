import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

// Cart items are stored as product option lines: productId + size + color + quantity.
// Pass the product array so this hook can calculate totals from product prices.
export function useCart(products = [], storageKey = "ecommerce-kit:cart") {
  const [cartItems, setCartItems] = useLocalStorage(storageKey, []);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const addToCart = ({ productId, size, color, quantity = 1 }) => {
    setCartItems((currentItems) => {
      // Merge identical product/size/color lines instead of duplicating them.
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingIndex === -1) {
        return [...currentItems, { productId, size, color, quantity }];
      }

      return currentItems.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    });
  };

  const removeFromCart = ({ productId, size, color }) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const updateCartItemQuantity = ({ productId, size, color, quantity }) => {
    // Quantity below 1 means the user intends to remove the line item.
    if (quantity < 1) {
      removeFromCart({ productId, size, color });
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const isInCart = ({ productId, size, color }) =>
    cartItems.some(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );

  const cartTotal = cartItems.reduce((total, item) => {
    // Missing products are ignored so deleted/changed mock data does not break the cart.
    const product = productById.get(item.productId);
    return product ? total + product.price * item.quantity : total;
  }, 0);

  return {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    isInCart,
  };
}
