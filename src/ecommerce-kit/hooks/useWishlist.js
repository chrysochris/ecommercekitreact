import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

// Store only product IDs so your wishlist stays independent from any product schema.
export function useWishlist(storageKey = "ecommerce-kit:wishlist") {
  const [wishlistIds, setWishlistIds] = useLocalStorage(storageKey, []);

  const wishlistIdSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  const isWishlisted = (productId) => wishlistIdSet.has(productId);

  // Call this twice to toggle the same product in and out of your wishlist.
  const toggleWishlist = (productId) => {
    setWishlistIds((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId]
    );
  };

  const clearWishlist = () => setWishlistIds([]);

  return {
    wishlistIds,
    isWishlisted,
    toggleWishlist,
    clearWishlist,
  };
}
