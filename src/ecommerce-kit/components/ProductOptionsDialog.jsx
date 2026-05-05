import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveIcon from "@mui/icons-material/Remove";

const colorMap = {
  Black: "#20201d",
  Blue: "#4c9bd8",
  Brown: "#b77d42",
  Green: "#91d9c3",
  Grey: "#a5afaf",
  Natural: "#d8c8ad",
  White: "#f7f4ed",
};

// Provide either a single product.image or an images[] gallery for each product.
function getProductImages(product) {
  return product.images?.length ? product.images : [product.image];
}

// Use this quick-view modal from ProductCard or your own product trigger.
// It gives you gallery navigation, variant selection, wishlist, quantity, and add-to-cart.
export function ProductOptionsDialog({
  open,
  product,
  products = [product],
  currency = "$",
  isWishlisted = false,
  isInCart,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) {
  const [activeProduct, setActiveProduct] = useState(product);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    // Reset selections whenever you open a new product.
    setActiveProduct(product);
    setActiveImageIndex(0);
    setSelectedSize(product.sizes[0] ?? "");
    setSelectedColor(product.colors[0] ?? "");
    setQuantity(1);
    setErrors({});
  }, [open, product]);

  const productIndex = products.findIndex((item) => item.id === activeProduct.id);
  const images = getProductImages(activeProduct);
  const activeImage = images[activeImageIndex] ?? activeProduct.image;
  const productIsWishlisted =
    typeof isWishlisted === "function"
      ? Boolean(isWishlisted(activeProduct.id))
      : Boolean(isWishlisted);

  const alreadyInCart = useMemo(() => {
    if (!selectedSize || !selectedColor || !isInCart) return false;

    return isInCart({
      productId: activeProduct.id,
      size: selectedSize,
      color: selectedColor,
    });
  }, [activeProduct.id, isInCart, selectedColor, selectedSize]);

  const goToProduct = (direction) => {
    if (products.length < 2) return;

    const nextIndex =
      (productIndex + direction + products.length) % products.length;
    const nextProduct = products[nextIndex];

    setActiveProduct(nextProduct);
    setActiveImageIndex(0);
    setSelectedSize(nextProduct.sizes[0] ?? "");
    setSelectedColor(nextProduct.colors[0] ?? "");
    setQuantity(1);
    setErrors({});
  };

  const handleSubmit = () => {
    // Require variant options before you create a cart line.
    const nextErrors = {
      size: selectedSize ? "" : "Select a size",
      color: selectedColor ? "" : "Select a color",
    };

    if (nextErrors.size || nextErrors.color) {
      setErrors(nextErrors);
      return;
    }

    onAddToCart?.({
      productId: activeProduct.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  const goToImage = (direction) => {
    if (images.length < 2) return;

    setActiveImageIndex(
      (currentIndex) => (currentIndex + direction + images.length) % images.length
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 0,
          width: { xs: "calc(100vw - 20px)", md: "min(1040px, calc(100vw - 48px))" },
          maxHeight: "calc(100dvh - 24px)",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(32, 32, 29, 0.22)",
        },
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          maxHeight: "calc(100dvh - 24px)",
          overflowY: "auto",
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ mb: { xs: 1.5, md: 2 } }}>
          <Stack direction="row" gap={1}>
            <IconButton
              aria-label="Previous product"
              onClick={() => goToProduct(-1)}
              sx={{
                width: 38,
                height: 38,
                borderRadius: 999,
                bgcolor: "#20201d",
                color: "white",
                "&:hover": { bgcolor: "#34342f" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              aria-label="Next product"
              onClick={() => goToProduct(1)}
              sx={{
                width: 38,
                height: 38,
                borderRadius: 999,
                bgcolor: "white",
                border: "1px solid #ece8e0",
                color: "#20201d",
                "&:hover": {
                  bgcolor: "rgba(32, 32, 29, 0.08)",
                  color: "#20201d",
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Stack>

          <IconButton
            aria-label="Close quick view"
            onClick={onClose}
            sx={{
              width: 38,
              height: 38,
              borderRadius: 999,
              bgcolor: "white",
              border: "1px solid #ece8e0",
              "&:hover": {
                bgcolor: "rgba(32, 32, 29, 0.08)",
                color: "#20201d",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 0.95fr) minmax(0, 1.05fr)", md: "1.05fr 0.95fr" },
            gap: { xs: 1.5, sm: 2.5, md: 3.5 },
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              position: "relative",
              border: "1px solid #ece8e0",
              p: { xs: 0.75, md: 1 },
              bgcolor: "white",
            }}
          >
            <Box
              component="img"
              src={activeImage}
              alt={activeProduct.name}
              sx={{
                width: "100%",
                height: { xs: "min(34dvh, 260px)", sm: "min(58dvh, 420px)", md: "min(68dvh, 620px)" },
                objectFit: "cover",
                bgcolor: "#f1eee8",
              }}
            />

            {images.length > 1 && (
              <>
                <IconButton
                  aria-label="Previous product image"
                  onClick={() => goToImage(-1)}
                  sx={{
                    position: "absolute",
                    left: { xs: 10, md: 14 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: { xs: 32, md: 38 },
                    height: { xs: 32, md: 38 },
                    borderRadius: 999,
                    bgcolor: "rgba(255, 255, 255, 0.86)",
                    color: "#20201d",
                    boxShadow: "0 8px 24px rgba(32, 32, 29, 0.12)",
                    "&:hover": {
                      bgcolor: "#20201d",
                      color: "white",
                    },
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>

                <IconButton
                  aria-label="Next product image"
                  onClick={() => goToImage(1)}
                  sx={{
                    position: "absolute",
                    right: { xs: 10, md: 14 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: { xs: 32, md: 38 },
                    height: { xs: 32, md: 38 },
                    borderRadius: 999,
                    bgcolor: "rgba(255, 255, 255, 0.86)",
                    color: "#20201d",
                    boxShadow: "0 8px 24px rgba(32, 32, 29, 0.12)",
                    "&:hover": {
                      bgcolor: "#20201d",
                      color: "white",
                    },
                  }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>

                <Stack
                  direction="row"
                  gap={0.75}
                  sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: { xs: 12, md: 16 },
                    transform: "translateX(-50%)",
                  }}
                >
                  {images.map((image, index) => (
                    <Box
                      key={`${image}-${index}`}
                      component="button"
                      aria-label={`Show product image ${index + 1}`}
                      onClick={() => setActiveImageIndex(index)}
                      sx={{
                        width: 7,
                        height: 7,
                        p: 0,
                        border: "1px solid white",
                        borderRadius: "50%",
                        bgcolor:
                          activeImageIndex === index
                            ? "#20201d"
                            : "rgba(255,255,255,0.75)",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </Stack>
              </>
            )}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#9d978e",
                fontWeight: 900,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                fontSize: { xs: "0.58rem", sm: "0.66rem" },
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Home / {activeProduct.category} / {activeProduct.name}
            </Typography>

            <Typography
              variant="h3"
              component="h2"
              sx={{
                mt: 1,
                fontSize: { xs: "1.35rem", sm: "1.8rem", md: "2.25rem" },
                lineHeight: 1.02,
                fontWeight: 900,
                color: "#20201d",
                letterSpacing: 0,
              }}
            >
              {activeProduct.name}
            </Typography>
            <Typography
              sx={{
                mt: 0.75,
                color: "#6bbeb0",
                fontSize: { xs: "0.85rem", md: "1rem" },
                fontWeight: 900,
                letterSpacing: 2,
              }}
            >
              {currency}
              {activeProduct.price.toFixed(2)}
            </Typography>

            <Box sx={{ my: { xs: 1.5, md: 2.25 }, borderTop: "1px solid #ece8e0" }} />

            <OptionSection title="Select color" error={errors.color}>
              <Stack direction="row" gap={{ xs: 0.75, md: 1.1 }} flexWrap="wrap">
                {activeProduct.colors.map((color) => (
                  <Box
                    key={color}
                    component="button"
                    aria-label={`Select ${color}`}
                    onClick={() => {
                      setSelectedColor(color);
                      setErrors((current) => ({ ...current, color: "" }));
                    }}
                    sx={{
                      width: { xs: 22, sm: 26, md: 28 },
                      height: { xs: 22, sm: 26, md: 28 },
                      borderRadius: "50%",
                      border:
                        selectedColor === color
                          ? "2px solid #20201d"
                          : "1px solid #eee9e2",
                      outline: "3px solid white",
                      boxShadow: "0 0 0 1px #eee9e2",
                      bgcolor: colorMap[color] ?? color.toLowerCase(),
                      cursor: "pointer",
                      transition: "transform 160ms ease, border-color 160ms ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        borderColor: "#20201d",
                      },
                    }}
                  />
                ))}
              </Stack>
            </OptionSection>

            <DividerLine />

            <OptionSection title="Select size" error={errors.size}>
              <Stack direction="row" gap={{ xs: 0.75, md: 1 }} flexWrap="wrap">
                {activeProduct.sizes.map((size) => (
                  <Button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setErrors((current) => ({ ...current, size: "" }));
                    }}
                    variant="outlined"
                    sx={{
                      minWidth: { xs: 29, sm: 34, md: 36 },
                      width: { xs: 29, sm: 34, md: 36 },
                      height: { xs: 29, sm: 34, md: 36 },
                      p: 0,
                      borderRadius: "50%",
                      borderColor:
                        selectedSize === size ? "#20201d" : "#eee9e2",
                      color: selectedSize === size ? "#20201d" : "#20201d",
                      bgcolor:
                        selectedSize === size
                          ? "rgba(32, 32, 29, 0.08)"
                          : "white",
                      fontSize: { xs: "0.58rem", sm: "0.66rem" },
                      fontWeight: 900,
                      "&:hover": {
                        borderColor: "#20201d",
                        bgcolor: "rgba(32, 32, 29, 0.08)",
                      },
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </Stack>
            </OptionSection>

            <DividerLine />

            <Stack
              direction="row"
              gap={{ xs: 0.75, md: 1.25 }}
              alignItems="center"
              flexWrap="wrap"
            >
              <Stack
                direction="row"
                sx={{
                  width: { xs: 112, sm: 138, md: 154 },
                  height: { xs: 38, md: 44 },
                  border: "1px solid #eee9e2",
                  borderRadius: 999,
                  overflow: "hidden",
                  bgcolor: "white",
                }}
              >
                <IconButton
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  sx={{
                    flex: 1,
                    borderRadius: 0,
                    color: "#9d978e",
                    "&:hover": {
                      color: "#20201d",
                      bgcolor: "rgba(32, 32, 29, 0.08)",
                    },
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <Box
                  sx={{
                    flex: 1,
                    display: "grid",
                    placeItems: "center",
                    borderLeft: "1px solid #eee9e2",
                    borderRight: "1px solid #eee9e2",
                    fontWeight: 900,
                  }}
                >
                  {quantity}
                </Box>
                <IconButton
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  sx={{
                    flex: 1,
                    borderRadius: 0,
                    color: "#9d978e",
                    "&:hover": {
                      color: "#20201d",
                      bgcolor: "rgba(32, 32, 29, 0.08)",
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>

              <IconButton
                aria-label={
                  productIsWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                onClick={() => onToggleWishlist?.(activeProduct.id)}
                sx={{
                  width: { xs: 38, md: 44 },
                  height: { xs: 38, md: 44 },
                  border: "1px solid #eee9e2",
                  color: productIsWishlisted ? "#c24155" : "#20201d",
                  "&:hover": {
                    bgcolor: productIsWishlisted ? "#fff1f3" : "#f4f2ec",
                    color: productIsWishlisted ? "#9f2f42" : "#20201d",
                  },
                }}
              >
                {productIsWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={alreadyInCart}
                sx={{
                  minWidth: { xs: 124, sm: 150 },
                  height: { xs: 38, md: 44 },
                  px: { xs: 2, md: 3 },
                  borderRadius: 999,
                  bgcolor: "#20201d",
                  color: "white",
                  fontSize: { xs: "0.64rem", sm: "0.72rem" },
                  fontWeight: 900,
                  letterSpacing: 0.4,
                  "&:hover": { bgcolor: "#34342f" },
                  "&.Mui-disabled": {
                    bgcolor: "#d7d1c8",
                    color: "#7a746b",
                  },
                }}
              >
                {alreadyInCart ? "Already in cart" : "Add to cart"}
              </Button>
            </Stack>

            <DividerLine />

            <Stack gap={0.5}>
              <InfoLine label="SKU" value={activeProduct.sku ?? activeProduct.id} />
              <InfoLine label="Category" value={activeProduct.category} />
              <InfoLine
                label="Tags"
                value={(activeProduct.tags ?? activeProduct.colors).join(", ")}
              />
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function OptionSection({ title, error, children }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: { xs: 0.8, md: 1.25 },
          color: "#383832",
          fontWeight: 900,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          fontSize: { xs: "0.58rem", sm: "0.66rem" },
        }}
      >
        {title}
      </Typography>
      {children}
      {error && (
        <Typography sx={{ mt: 0.5, color: "#c24155", fontSize: "0.72rem" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

function DividerLine() {
  return <Box sx={{ my: { xs: 1.5, md: 2.25 }, borderTop: "1px solid #ece8e0" }} />;
}

function InfoLine({ label, value }) {
  return (
    <Typography
      sx={{
        color: "#9d978e",
        fontSize: { xs: "0.58rem", sm: "0.68rem" },
        fontWeight: 900,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        lineHeight: 1.6,
      }}
    >
      {label}:{" "}
      <Box component="span" sx={{ color: "#6f6a62" }}>
        {value}
      </Box>
    </Typography>
  );
}
