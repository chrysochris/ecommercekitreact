import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const swatchColors = {
  Black: "#20201d",
  Blue: "#4c9bd8",
  Brown: "#b77d42",
  Green: "#91d9c3",
  Grey: "#a5afaf",
  Natural: "#d8c8ad",
  White: "#f7f4ed",
};

// Product detail supports a single product.image or a product.images gallery.
function getProductImages(product) {
  return product.images?.length ? product.images : [product.image];
}

export function ProductDetailPage({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBack,
  currency = "$",
}) {
  const images = getProductImages(product);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const liked = isWishlisted?.(product.id);

  const addSelectedProductToCart = () => {
    // Match the cart line shape used by useCart.
    onAddToCart?.({
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={outlineButtonSx}
      >
        Back to catalog
      </Button>

      <Box sx={detailGridSx}>
        <Box sx={imagePanelSx}>
          <Box
            component="img"
            src={images[activeImageIndex]}
            alt={product.name}
            sx={detailImageSx}
          />
          {images.length > 1 && (
            // Dots can be replaced with thumbnails if the buyer wants a richer gallery.
            <Stack direction="row" gap={1} sx={imageDotsSx}>
              {images.map((image, index) => (
                <Box
                  key={`${image}-${index}`}
                  component="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Show ${product.name} image ${index + 1}`}
                  sx={{
                    width: 9,
                    height: 9,
                    p: 0,
                    borderRadius: "50%",
                    border: "1px solid white",
                    bgcolor:
                      activeImageIndex === index
                        ? "#20201d"
                        : "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        <Box>
          <Typography sx={breadcrumbSx}>
            Home / {product.category} / {product.name}
          </Typography>
          <Typography component="h1" sx={titleSx}>
            {product.name}
          </Typography>
          <Typography sx={priceSx}>
            {currency}
            {product.price.toFixed(2)}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <ProductOptionBlock title="Select color">
            <Stack direction="row" gap={1.2} flexWrap="wrap">
              {product.colors.map((color) => (
                <Box
                  key={color}
                  component="button"
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border:
                      selectedColor === color
                        ? "2px solid #20201d"
                        : "1px solid #e4ded4",
                    outline: "3px solid white",
                    boxShadow: "0 0 0 1px #e4ded4",
                    bgcolor: swatchColors[color] ?? color.toLowerCase(),
                    cursor: "pointer",
                  }}
                />
              ))}
            </Stack>
          </ProductOptionBlock>

          <Divider sx={{ my: 3 }} />

          <ProductOptionBlock title="Select size">
            <Stack direction="row" gap={1} flexWrap="wrap">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    minWidth: 42,
                    width: 42,
                    height: 42,
                    p: 0,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: selectedSize === size ? "#20201d" : "#e4ded4",
                    color: selectedSize === size ? "white" : "#20201d",
                    bgcolor: selectedSize === size ? "#20201d" : "white",
                    "&:hover": {
                      bgcolor: selectedSize === size ? "#34342f" : "#efede8",
                    },
                  }}
                >
                  {size}
                </Button>
              ))}
            </Stack>
          </ProductOptionBlock>

          <Divider sx={{ my: 3 }} />

          <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
            <QuantityControl
              quantity={quantity}
              onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
              onIncrease={() => setQuantity((value) => value + 1)}
            />
            <IconButton
              onClick={() => onToggleWishlist?.(product.id)}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                width: 48,
                height: 48,
                border: "1px solid #e4ded4",
                color: liked ? "#c24155" : "#20201d",
                "&:hover": {
                  bgcolor: liked ? "#fff1f3" : "#f4f2ec",
                  color: liked ? "#9f2f42" : "#20201d",
                },
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Button
              variant="outlined"
              onClick={() => onToggleWishlist?.(product.id)}
              sx={{
                display: { xs: "inline-flex", sm: "none" },
                width: "100%",
                height: 48,
                borderRadius: 999,
                borderColor: liked ? "#c24155" : "#20201d",
                color: liked ? "#c24155" : "#20201d",
                fontWeight: 900,
                "&:hover": {
                  borderColor: liked ? "#9f2f42" : "#34342f",
                  bgcolor: liked ? "#fff1f3" : "#f4f2ec",
                },
              }}
            >
              {liked ? "Remove from wishlist" : "Add to wishlist"}
            </Button>
            <Button
              variant="contained"
              onClick={addSelectedProductToCart}
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: 180,
                height: 48,
                borderRadius: 999,
                bgcolor: "#20201d",
                "&:hover": { bgcolor: "#34342f" },
              }}
            >
              Add to cart
            </Button>
          </Stack>

          <Stack gap={0.75} sx={{ mt: 4 }}>
            <InfoLine label="SKU" value={product.sku ?? product.id} />
            <InfoLine label="Category" value={product.category} />
            <InfoLine label="Tags" value={(product.tags ?? product.colors).join(", ")} />
          </Stack>

          <Box sx={{ mt: 4 }}>
            {/* Replace these policy strings with store-specific content. */}
            <ProductInfoAccordion
              title="Shipping"
              body="Use this accordion for delivery times, carriers, regions, and shipping costs. Replace the sample text with your store policy."
            />
            <ProductInfoAccordion
              title="Returns"
              body="Use this accordion for return windows, item condition rules, exchange options, and refund details."
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

function ProductOptionBlock({ title, children }) {
  return (
    <Box>
      <Typography sx={optionTitleSx}>{title}</Typography>
      {children}
    </Box>
  );
}

function ProductInfoAccordion({ title, body }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        bgcolor: "transparent",
        borderTop: "1px solid #e4ded4",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          {body}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <Stack direction="row" alignItems="center" sx={quantitySx}>
      <IconButton size="small" onClick={onDecrease}>-</IconButton>
      <Typography sx={{ flex: 1, textAlign: "center", fontWeight: 900 }}>
        {quantity}
      </Typography>
      <IconButton size="small" onClick={onIncrease}>+</IconButton>
    </Stack>
  );
}

function InfoLine({ label, value }) {
  return (
    <Typography sx={infoLineSx}>
      {label}: <Box component="span" sx={{ color: "#6f6a62" }}>{value}</Box>
    </Typography>
  );
}

const outlineButtonSx = {
  mb: 3,
  borderRadius: 999,
  px: 3,
  borderColor: "#20201d",
  color: "#20201d",
  fontWeight: 900,
  "&:hover": {
    borderColor: "#34342f",
    bgcolor: "rgba(32,32,29,0.08)",
  },
};

const detailGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
  gap: { xs: 3, md: 5 },
  alignItems: "start",
};

const imagePanelSx = {
  position: "relative",
  p: 1,
  border: "1px solid #e4ded4",
  borderRadius: 2,
  bgcolor: "rgba(255,255,255,0.74)",
};

const detailImageSx = {
  width: "100%",
  height: { xs: 420, sm: 560, md: "min(72dvh, 720px)" },
  objectFit: "cover",
  borderRadius: 1.5,
  bgcolor: "#efede8",
};

const imageDotsSx = {
  position: "absolute",
  left: "50%",
  bottom: 24,
  transform: "translateX(-50%)",
};

const breadcrumbSx = {
  color: "#9d978e",
  fontSize: "0.75rem",
  fontWeight: 900,
  letterSpacing: 1,
  textTransform: "uppercase",
};

const titleSx = {
  mt: 1,
  fontSize: { xs: "2.4rem", md: "4rem" },
  lineHeight: 0.95,
  fontWeight: 900,
  letterSpacing: 0,
};

const priceSx = {
  mt: 1,
  color: "#6f6a62",
  fontSize: "1.25rem",
  fontWeight: 900,
  letterSpacing: 1.2,
};

const optionTitleSx = {
  mb: 1.5,
  fontSize: "0.72rem",
  fontWeight: 900,
  letterSpacing: 1,
  textTransform: "uppercase",
};

const quantitySx = {
  minWidth: 116,
  height: 40,
  px: 1,
  borderRadius: 999,
  bgcolor: "#efede8",
};

const infoLineSx = {
  color: "#9d978e",
  fontSize: "0.76rem",
  fontWeight: 900,
  letterSpacing: 0.7,
  textTransform: "uppercase",
};
