import { Box, Typography } from "@mui/material";
import { ProductCard } from "./ProductCard.jsx";

// Responsive grid wrapper for ProductCard.
// Pass allProducts when quick-view next/previous should use the full filtered list.
export function ProductGrid({
  products,
  allProducts = products,
  currency = "$",
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  emptyMessage = "No products found.",
  enableCart = true,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onProductClick,
}) {
  if (products.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${columns.xs ?? 1}, minmax(0, 1fr))`,
          sm: `repeat(${columns.sm ?? 2}, minmax(0, 1fr))`,
          md: `repeat(${columns.md ?? 3}, minmax(0, 1fr))`,
          lg: `repeat(${columns.lg ?? 4}, minmax(0, 1fr))`,
        },
        gap: 3,
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          products={allProducts}
          currency={currency}
          enableCart={enableCart}
          isWishlisted={isWishlisted}
          isInCart={isInCart}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      ))}
    </Box>
  );
}
