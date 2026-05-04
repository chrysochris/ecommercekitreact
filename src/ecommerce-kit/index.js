// Public API for the component pack.
// Buyers can import everything they need from this file instead of deep paths.
export { Filters } from "./components/Filters.jsx";
export { Pagination } from "./components/Pagination.jsx";
export { ProductCard } from "./components/ProductCard.jsx";
export { ProductGrid } from "./components/ProductGrid.jsx";
export { ProductOptionsDialog } from "./components/ProductOptionsDialog.jsx";
export { sampleProducts } from "./data/sampleProducts.js";

// Reusable state hooks. These are intentionally UI-agnostic.
export { useCart } from "./hooks/useCart.js";
export { useLocalStorage } from "./hooks/useLocalStorage.js";
export { usePagination } from "./hooks/usePagination.js";
export { useProductFilters } from "./hooks/useProductFilters.js";
export { useWishlist } from "./hooks/useWishlist.js";

// Full-page storefront templates built from the lower-level components.
export { CartPage } from "./templates/CartPage.jsx";
export { ProductDetailPage } from "./templates/ProductDetailPage.jsx";
export { ProductListingPage } from "./templates/ProductListingPage.jsx";
export { StoreTopBar } from "./templates/StoreTopBar.jsx";
export { WishlistPage } from "./templates/WishlistPage.jsx";
