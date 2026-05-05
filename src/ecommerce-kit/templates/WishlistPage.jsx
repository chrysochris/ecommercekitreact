import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ProductGrid } from "../components/ProductGrid.jsx";

// Use this full wishlist page template when you need a ready-made saved-products view.
// Pass your already-filtered wishlist products so this page can focus on display/actions.
export function WishlistPage({
  products,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onProductClick,
  onContinue,
}) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.2rem", md: "3.4rem" },
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: 0,
            }}
          >
            Wishlist
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Saved products appear here. Click the filled heart again to remove an item.
          </Typography>
        </Box>
        <Button variant="contained" onClick={onContinue} sx={blackButtonSx}>
          Continue shopping
        </Button>
      </Stack>

      {products.length === 0 ? (
        // Keep this empty state so your buyers get a complete page flow.
        <EmptyState
          title="No wishlist products yet"
          body="Save a product from the storefront demo and it will appear here."
          action="Browse catalog"
          onAction={onContinue}
        />
      ) : (
        <ProductGrid
          products={products}
          allProducts={products}
          currency="$"
          isWishlisted={isWishlisted}
          isInCart={isInCart}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      )}
    </Container>
  );
}

function EmptyState({ title, body, action, onAction }) {
  return (
    <Box sx={emptySx}>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 1, mb: 3, color: "text.secondary" }}>{body}</Typography>
      <Button variant="contained" onClick={onAction} sx={blackButtonSx}>
        {action}
      </Button>
    </Box>
  );
}

const blackButtonSx = {
  alignSelf: { sm: "center" },
  borderRadius: 999,
  bgcolor: "#20201d",
  "&:hover": { bgcolor: "#34342f" },
};

const emptySx = {
  p: { xs: 4, md: 6 },
  border: "1px solid #e4ded4",
  borderRadius: 3,
  bgcolor: "rgba(255,255,255,0.74)",
  textAlign: "center",
};
