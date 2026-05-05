// Import the kit from this public API instead of deep paths.
// Use these exports to copy components, hooks, templates, and sample data into your app.
export { Filters } from "./components/Filters.jsx";
export { Pagination } from "./components/Pagination.jsx";
export { ProductCard } from "./components/ProductCard.jsx";
export { ProductGrid } from "./components/ProductGrid.jsx";
export { ProductOptionsDialog } from "./components/ProductOptionsDialog.jsx";
export { sampleProducts } from "./data/sampleProducts.js";

// Use these UI-agnostic hooks when you want to control state in your own pages.
export { useCart } from "./hooks/useCart.js";
export { useLocalStorage } from "./hooks/useLocalStorage.js";
export { usePagination } from "./hooks/usePagination.js";
export { useProductFilters } from "./hooks/useProductFilters.js";
export { useWishlist } from "./hooks/useWishlist.js";

// Use these full-page templates when you want ready-made storefront screens.
export { CartPage } from "./templates/CartPage.jsx";
export { ProductDetailPage } from "./templates/ProductDetailPage.jsx";
export { ProductListingPage } from "./templates/ProductListingPage.jsx";
export { StoreTopBar } from "./templates/StoreTopBar.jsx";
export { WishlistPage } from "./templates/WishlistPage.jsx";
