import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

// Stores only product IDs, keeping the hook independent from any product schema.
export function useWishlist(storageKey = "ecommerce-kit:wishlist") {
  const [wishlistIds, setWishlistIds] = useLocalStorage(storageKey, []);

  const wishlistIdSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  const isWishlisted = (productId) => wishlistIdSet.has(productId);

  // Calling this twice toggles the same product in and out of the wishlist.
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
