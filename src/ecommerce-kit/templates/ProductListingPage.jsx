import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { Filters } from "../components/Filters.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { ProductGrid } from "../components/ProductGrid.jsx";

// Use this full product listing template to compose Filters, ProductGrid, and Pagination.
// Keep filter/cart/wishlist state in your parent and pass handlers through props.
export function ProductListingPage({
  title = "Products",
  eyebrow = "Storefront preview",
  description,
  filterProps,
  products,
  allProducts = products,
  filteredCount = products.length,
  cartTotal = 0,
  currentPage,
  pageCount,
  onPageChange,
  isMobile = false,
  filtersOpen = false,
  onOpenFilters,
  onCloseFilters,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onProductClick,
  productsTopRef,
}) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Typography
          sx={{
            color: "#20201d",
            fontWeight: 900,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            fontSize: "0.78rem",
          }}
        >
          {eyebrow}
        </Typography>
        <Typography
          component="h1"
          sx={{
            maxWidth: 760,
            fontSize: { xs: "2rem", md: "3.4rem" },
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 0,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography sx={{ maxWidth: 720, color: "text.secondary" }}>
            {description}
          </Typography>
        )}
      </Stack>

      {isMobile && (
        // Move filters into a modal on small screens to preserve product grid space.
        <Button
          variant="contained"
          startIcon={<TuneIcon />}
          onClick={onOpenFilters}
          sx={{
            mb: 3,
            borderRadius: 999,
            bgcolor: "#20201d",
            "&:hover": { bgcolor: "#34342f" },
          }}
        >
          Filters
        </Button>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
          gap: { xs: 4, md: 5 },
          alignItems: "start",
        }}
      >
        {!isMobile && <Filters {...filterProps} />}

        <Box ref={productsTopRef} sx={{ display: "grid", gap: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            gap={1}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 0 }}>
              Sample catalog
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {filteredCount} products - Cart total: ${cartTotal.toFixed(2)}
            </Typography>
          </Stack>

          <ProductGrid
            products={products}
            allProducts={allProducts}
            currency="$"
            isWishlisted={isWishlisted}
            isInCart={isInCart}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />

          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={onPageChange}
          />
        </Box>
      </Box>

      <Dialog open={filtersOpen} onClose={onCloseFilters} fullWidth maxWidth="xs">
        <DialogContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Filters
            </Typography>
            <IconButton onClick={onCloseFilters}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Filters {...filterProps} hideTitle />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
