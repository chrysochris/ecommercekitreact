import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ProductOptionsDialog } from "./ProductOptionsDialog.jsx";

// Reusable product card.
// The card can either open a custom product page via onProductClick or open quick view.
export function ProductCard({
  product,
  currency = "$",
  isWishlisted = false,
  enableCart = true,
  products = [product],
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onProductClick,
}) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const productIsWishlisted =
    typeof isWishlisted === "function"
      ? Boolean(isWishlisted(product.id))
      : Boolean(isWishlisted);

  // Product image click is intentionally separate from the Quick view button.
  // Pass onProductClick when you want a full product page.
  const handleCardImageClick = () => {
    if (onProductClick) {
      onProductClick(product);
      return;
    }

    if (enableCart) {
      setOptionsOpen(true);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "background.paper",
          transition: "transform 180ms ease, box-shadow 180ms ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 18px 45px rgba(32, 32, 29, 0.12)",
          },
          "&:hover .product-card-image": {
            transform: "scale(1.045)",
          },
          "&:hover .product-card-overlay": {
            opacity: 1,
          },
        }}
      >
        <Box
          onClick={handleCardImageClick}
          sx={{
            position: "relative",
            overflow: "hidden",
            cursor: onProductClick || enableCart ? "pointer" : "default",
          }}
        >
          <CardMedia
            className="product-card-image"
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              aspectRatio: { xs: "4 / 4.35", sm: "4 / 4.7", md: "4 / 5" },
              objectFit: "cover",
              bgcolor: "grey.100",
              transition: "transform 260ms ease",
            }}
          />
          <Box
            className="product-card-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              transition: "opacity 220ms ease",
              background:
                "linear-gradient(180deg, rgba(32,32,29,0.02) 20%, rgba(32,32,29,0.28) 100%)",
              pointerEvents: "none",
            }}
          />
          <IconButton
            aria-label={
              productIsWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            onClick={(event) => {
              event.stopPropagation();
              onToggleWishlist?.(product.id);
            }}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "background.paper",
              boxShadow: 1,
              color: productIsWishlisted ? "#c24155" : "#20201d",
              "&:hover": {
                bgcolor: "rgba(32,32,29,0.08)",
                color: productIsWishlisted ? "#9f2f42" : "#20201d",
              },
            }}
          >
            {productIsWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
            {product.category}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Typography sx={{ mt: 0.5, color: "text.secondary" }}>
            {currency}
            {product.price.toFixed(2)}
          </Typography>

          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
            {product.colors.slice(0, 3).map((color) => (
              <Chip key={color} label={color} size="small" variant="outlined" />
            ))}
          </Stack>
        </CardContent>

        {enableCart && (
          <CardActions sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => setOptionsOpen(true)}
              sx={{
                borderRadius: 999,
                bgcolor: "#20201d",
                "&:hover": { bgcolor: "#34342f" },
              }}
            >
              Quick view
            </Button>
          </CardActions>
        )}
      </Card>

      {enableCart && (
        <ProductOptionsDialog
          open={optionsOpen}
          product={product}
          products={products}
          currency={currency}
          isWishlisted={isWishlisted}
          isInCart={isInCart}
          onClose={() => setOptionsOpen(false)}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
}
