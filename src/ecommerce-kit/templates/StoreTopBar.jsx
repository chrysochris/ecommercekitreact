import {
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

// Use this reusable navigation bar at the top of your storefront pages.
// Control navigation from your parent through onNavigate, router links, or local state.
export function StoreTopBar({
  storeName = "Atelier Store",
  activeView = "products",
  wishlistCount = 0,
  cartQuantity = 0,
  onNavigate,
}) {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        bgcolor: "rgba(244, 242, 236, 0.9)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid #e5ded4",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          minHeight: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          component="button"
          onClick={() => onNavigate?.("products")}
          sx={storeNameSx}
        >
          {storeName}
        </Box>

        <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 2 }}>
          {/* Configure your text links here; the icons stay visible on mobile. */}
          {[
            ["products", "Products"],
            ["wishlist", "Wishlist"],
            ["cart", "Cart"],
          ].map(([view, label]) => (
            <Button
              key={view}
              onClick={() => onNavigate?.(view)}
              color="inherit"
              sx={{
                display:
                  view === "products"
                    ? "inline-flex"
                    : { xs: "none", sm: "inline-flex" },
                minWidth: { xs: 0, sm: 64 },
                px: { xs: 1.25, sm: 2 },
                borderRadius: 999,
                color: "#20201d",
                bgcolor:
                  activeView === view ? "rgba(32,32,29,0.08)" : "transparent",
              }}
            >
              {label}
            </Button>
          ))}

          <IconButton onClick={() => onNavigate?.("wishlist")} sx={topBarIconButtonSx}>
            <Badge badgeContent={wishlistCount} color="error">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={() => onNavigate?.("cart")} sx={topBarIconButtonSx}>
            <Badge badgeContent={cartQuantity} color="primary">
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
}

const storeNameSx = {
  p: 0,
  border: 0,
  bgcolor: "transparent",
  color: "#20201d",
  font: "inherit",
  fontSize: { xs: "1.05rem", md: "1.25rem" },
  fontWeight: 900,
  letterSpacing: 0,
  cursor: "pointer",
};

const topBarIconButtonSx = {
  "&:hover": {
    bgcolor: "#f4f2ec",
  },
};
