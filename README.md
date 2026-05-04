# React E-commerce Components Pack

A reusable React storefront UI kit for developers. It includes product cards, responsive product grids, accordion filters, wishlist logic, cart logic, checkout steps, product quick view, product detail layout, pagination, mock data, and a polished demo storefront.

## What The Kit Includes

- `ProductCard` with image hover, wishlist toggle, and quick-view cart action
- `ProductGrid` for responsive product layouts
- `Filters` with accordion sections for category, size, and color filtering
- `Pagination` for paged product lists
- `ProductOptionsDialog` quick-view modal with image gallery, image arrows, product navigation, colors, sizes, quantity, wishlist, and add to cart
- `useWishlist` hook powered by `localStorage`
- `useCart` hook powered by `localStorage`, including quantity updates and item removal
- `useProductFilters` and `usePagination` hooks
- `sampleProducts` mock catalog with images, image galleries, SKU, tags, sizes, and colors
- Reusable storefront templates:
  - `StoreTopBar`
  - `ProductListingPage`
  - `ProductDetailPage`
  - `WishlistPage`
  - `CartPage` with cart, checkout details, and order complete steps
- Demo storefront with landing page plus a working preview using the reusable templates

## Installation

```bash
npm install
npm run dev
```

The project runs with Vite. Open the local URL printed in the terminal.

## Folder Structure

```text
src/
  ecommerce-kit/
    components/
      Filters.jsx
      Pagination.jsx
      ProductCard.jsx
      ProductGrid.jsx
      ProductOptionsDialog.jsx
    data/
      sampleProducts.js
    hooks/
      useCart.js
      useLocalStorage.js
      usePagination.js
      useProductFilters.js
      useWishlist.js
    templates/
      CartPage.jsx
      ProductDetailPage.jsx
      ProductListingPage.jsx
      StoreTopBar.jsx
      WishlistPage.jsx
    index.js
  demo/
    DemoPage.jsx
  App.jsx
  main.jsx
  index.scss
```

`src/ecommerce-kit` is the reusable product buyers copy into their own React app. `src/demo` is only the marketing/demo preview used to show how the kit works.

## Product Data Shape

Each product should follow this shape:

```js
{
  id: "minimal-tee-black",
  sku: "SKU-1001",
  name: "Minimal Cotton Tee",
  category: "Tops",
  price: 29,
  sizes: ["XS", "S", "M", "L"],
  colors: ["Black", "White"],
  tags: ["cotton", "daily", "minimal"],
  image: "https://example.com/product-card.jpg",
  images: [
    "https://example.com/product-front.jpg",
    "https://example.com/product-detail.jpg"
  ]
}
```

`images`, `sku`, and `tags` are optional, but they power the quick-view gallery, product detail page, and metadata sections.

## Basic Usage

```jsx
import {
  Filters,
  Pagination,
  ProductGrid,
  sampleProducts,
  useCart,
  usePagination,
  useProductFilters,
  useWishlist,
} from "./ecommerce-kit";

export default function ProductsPage() {
  const {
    filters,
    filteredProducts,
    hasActiveFilters,
    toggleFilter,
    clearFilters,
  } = useProductFilters(sampleProducts);

  const { wishlistIds, isWishlisted, toggleWishlist } = useWishlist();
  const { cartItems, cartTotal, addToCart, isInCart } = useCart(sampleProducts);

  const { currentPage, pageCount, paginatedItems, goToPage } = usePagination(
    filteredProducts,
    8
  );

  return (
    <>
      <Filters
        categories={["Tops", "Shoes", "Accessories"]}
        sizes={["XS", "S", "M", "L", "XL"]}
        colors={["Black", "White", "Blue"]}
        selectedCategories={filters.categories}
        selectedSizes={filters.sizes}
        selectedColors={filters.colors}
        hasActiveFilters={hasActiveFilters}
        onCategoryChange={(value) => toggleFilter("categories", value)}
        onSizeChange={(value) => toggleFilter("sizes", value)}
        onColorChange={(value) => toggleFilter("colors", value)}
        onClearFilters={clearFilters}
      />

      <ProductGrid
        products={paginatedItems}
        allProducts={filteredProducts}
        currency="$"
        isWishlisted={isWishlisted}
        isInCart={isInCart}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onProductClick={(product) => console.log("Open product page", product)}
      />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={goToPage}
      />

      <p>Wishlist items: {wishlistIds.length}</p>
      <p>Cart items: {cartItems.length}</p>
      <p>Cart total: ${cartTotal.toFixed(2)}</p>
    </>
  );
}
```

## Component Notes

### ProductCard

`ProductCard` displays product image, category, name, price, colors, wishlist state, and add-to-cart action. Clicking the product image can open a custom product page through `onProductClick`. Clicking `Add to cart` opens the reusable quick-view modal.

```jsx
<ProductCard
  product={product}
  products={products}
  currency="$"
  isWishlisted={isWishlisted}
  enableCart={true}
  isInCart={isInCart}
  onToggleWishlist={toggleWishlist}
  onAddToCart={addToCart}
  onProductClick={(product) => openProductPage(product)}
/>
```

### ProductGrid

`ProductGrid` renders a responsive grid of `ProductCard` components. Pass `allProducts` when you want the quick-view modal next/previous buttons to navigate through the active product list.

```jsx
<ProductGrid
  products={paginatedItems}
  allProducts={filteredProducts}
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  emptyMessage="No products found."
  enableCart={true}
  isWishlisted={isWishlisted}
  isInCart={isInCart}
  onToggleWishlist={toggleWishlist}
  onAddToCart={addToCart}
/>
```

### Filters

`Filters` uses accordion sections and supports multi-select categories, sizes, and colors. In the demo, desktop shows filters beside the grid and mobile opens filters inside a popup.

```jsx
<Filters
  categories={categories}
  sizes={sizes}
  colors={colors}
  selectedCategories={filters.categories}
  selectedSizes={filters.sizes}
  selectedColors={filters.colors}
  hasActiveFilters={hasActiveFilters}
  onCategoryChange={(value) => toggleFilter("categories", value)}
  onSizeChange={(value) => toggleFilter("sizes", value)}
  onColorChange={(value) => toggleFilter("colors", value)}
  onClearFilters={clearFilters}
/>
```

### Pagination

```jsx
<Pagination
  currentPage={currentPage}
  pageCount={pageCount}
  onPageChange={goToPage}
/>
```

## Demo Flow

The demo in `src/demo/DemoPage.jsx` shows how to combine the reusable kit into a storefront:

1. Landing page for marketing the reusable digital product.
2. Storefront demo with topbar, wishlist/cart icons, filters, sample products, pagination, and quick view.
3. Dynamic product detail page with image gallery, variants, quantity, wishlist, add to cart, SKU/category/tags, shipping accordion, and returns accordion.
4. Wishlist page with liked product cards. Clicking the filled heart removes the product from the wishlist.
5. Cart page with quantity controls, remove item, order summary, checkout details form, and order complete step.

## Reusable Templates

The storefront pages are reusable exports, not just demo-only code:

```jsx
import {
  CartPage,
  ProductDetailPage,
  ProductListingPage,
  StoreTopBar,
  WishlistPage,
} from "./ecommerce-kit";
```

Use these when you want full page sections quickly. Use the lower-level components (`ProductCard`, `ProductGrid`, `Filters`, `Pagination`, `ProductOptionsDialog`) when you want to build your own layouts.

The landing page is intentionally not part of the reusable kit. It is sales/demo presentation only.

## Customization

### Colors And Radius

The kit uses a black-ish primary button style with rounded pill buttons. You can change the MUI theme in `src/App.jsx` and edit component `sx` styles for brand colors, hover colors, and radius.

### Product Data

Replace `src/ecommerce-kit/data/sampleProducts.js` with your own products, API data, or CMS data.

### Filter Options

Filter options are plain arrays. They can come from static values or generated unique values from your product data:

```js
const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Black", "White", "Blue"];
const categories = ["Tops", "Shoes", "Accessories"];
```

## Wishlist And localStorage

`useWishlist` stores product IDs in `localStorage` under:

```text
ecommerce-kit:wishlist
```

Use a custom key if you need separate stores:

```js
const wishlist = useWishlist("my-store:wishlist");
```

## Cart And localStorage

`useCart` stores cart lines in `localStorage` under:

```text
ecommerce-kit:cart
```

Each cart item stores `productId`, `size`, `color`, and `quantity`. Products with the same ID, size, and color are merged into one cart line.

```js
const cart = useCart(products, "my-store:cart");
```

## How To Package This As A Digital Product

You can keep the landing page, demo, and reusable kit in the same project. That is normal for a sellable UI kit. Think of the repo as two things:

- `src/ecommerce-kit`: the actual reusable product
- `src/demo`: the marketing/demo preview that proves the product works

Recommended buyer package:

```text
react-ecommerce-components-pack/
  README.md
  package.json
  vite.config.js
  index.html
  src/
    ecommerce-kit/
    demo/
    App.jsx
    main.jsx
    index.scss
```

This lets buyers run:

```bash
npm install
npm run dev
```

Then they can copy `src/ecommerce-kit` into their own project or study `src/demo/DemoPage.jsx` to see how the components are composed.

For marketplaces like Gumroad, Lemon Squeezy, Creative Market, or your own landing page, export a `.zip` containing this whole cleaned project. In your sales copy, explain that buyers receive both:

- the reusable component kit in `src/ecommerce-kit`
- a working demo storefront in `src/demo`

## Notes For Buyers

- Built with React, Vite, and MUI.
- No backend is required for the demo.
- Wishlist and cart are client-side examples using `localStorage`.
- Replace mock data and sample policies before using in production.
- Reusable entry point: `src/ecommerce-kit/index.js`.
