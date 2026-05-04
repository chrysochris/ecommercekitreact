import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CartPage,
  ProductDetailPage,
  ProductListingPage,
  sampleProducts,
  StoreTopBar,
  useCart,
  usePagination,
  useProductFilters,
  useWishlist,
  WishlistPage,
} from "../ecommerce-kit/index.js";

function getUniqueValues(products, field) {
  return [...new Set(products.flatMap((product) => product[field]))].sort();
}

export default function DemoPage() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [storeView, setStoreView] = useState("products");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    filters,
    filteredProducts,
    hasActiveFilters,
    toggleFilter,
    clearFilters,
  } = useProductFilters(sampleProducts);

  const { wishlistIds, isWishlisted, toggleWishlist } = useWishlist();
  const {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    isInCart,
  } = useCart(sampleProducts);
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { currentPage, pageCount, paginatedItems, goToPage } = usePagination(
    filteredProducts,
    8
  );
  const productsTopRef = useRef(null);

  const filterOptions = useMemo(
    () => ({
      categories: getUniqueValues(sampleProducts, "category"),
      sizes: getUniqueValues(sampleProducts, "sizes"),
      colors: getUniqueValues(sampleProducts, "colors"),
    }),
    []
  );

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath) => {
    const normalizedPath = normalizePath(nextPath);
    window.history.pushState({}, "", normalizedPath);
    setPath(normalizedPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const wishlistProducts = sampleProducts.filter((product) =>
    wishlistIds.includes(product.id)
  );

  const cartProducts = cartItems
    .map((item) => ({
      ...item,
      product: sampleProducts.find((product) => product.id === item.productId),
    }))
    .filter((item) => item.product);

  const handlePageChange = (page) => {
    goToPage(page);
    requestAnimationFrame(() => {
      productsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const filterProps = {
    categories: filterOptions.categories,
    sizes: filterOptions.sizes,
    colors: filterOptions.colors,
    selectedCategories: filters.categories,
    selectedSizes: filters.sizes,
    selectedColors: filters.colors,
    hasActiveFilters,
    onCategoryChange: (value) => toggleFilter("categories", value),
    onSizeChange: (value) => toggleFilter("sizes", value),
    onColorChange: (value) => toggleFilter("colors", value),
    onClearFilters: clearFilters,
  };

  const openProductPage = (product) => {
    setSelectedProduct(product);
    setStoreView("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateStore = (nextView) => {
    setStoreView(nextView === "products" ? "products" : nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <CssBaseline />
      {path === "/" ? (
        <LandingPage currentPath={path} onNavigate={navigate} />
      ) : path === "/demo" ? (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f4f2ec" }}>
          <StoreTopBar
            activeView={storeView === "product" ? "products" : storeView}
            cartQuantity={cartQuantity}
            wishlistCount={wishlistIds.length}
            onNavigate={navigateStore}
          />
          {storeView === "products" && (
            <ProductListingPage
              title="Reusable storefront preview"
              eyebrow="Live component demo"
              description="A responsive product listing built from the reusable ProductCard, ProductGrid, Filters, Pagination, wishlist, and cart hooks."
              filterProps={filterProps}
              products={paginatedItems}
              allProducts={filteredProducts}
              filteredCount={filteredProducts.length}
              productsTopRef={productsTopRef}
              isMobile={isMobile}
              filtersOpen={filtersOpen}
              onOpenFilters={() => setFiltersOpen(true)}
              onCloseFilters={() => setFiltersOpen(false)}
              cartTotal={cartTotal}
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              isInCart={isInCart}
              onProductClick={openProductPage}
            />
          )}
          {storeView === "cart" && (
            <CartPage
              checkoutStep={checkoutStep}
              onCheckoutStepChange={setCheckoutStep}
              cartProducts={cartProducts}
              cartTotal={cartTotal}
              onUpdateQuantity={updateCartItemQuantity}
              onRemove={removeFromCart}
              onClearCart={clearCart}
              onContinue={() => setStoreView("products")}
            />
          )}
          {storeView === "wishlist" && (
            <WishlistPage
              products={wishlistProducts}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              isInCart={isInCart}
              onProductClick={openProductPage}
              onContinue={() => setStoreView("products")}
            />
          )}
          {storeView === "product" && selectedProduct && (
            <ProductDetailPage
              product={selectedProduct}
              products={filteredProducts}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              onBack={() => setStoreView("products")}
            />
          )}
        </Box>
      ) : (
        <MarketingPage path={path} onNavigate={navigate} />
      )}
    </>
  );
}

function LandingPage({ currentPath, onNavigate }) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#151b18",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Box
        component="header"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 2, md: 4 },
        }}
      >
        <BrandMark />
        <Stack
          component="nav"
          direction="row"
          gap={4}
          sx={{
            display: { xs: "none", md: "flex" },
            color: "rgba(255,255,255,0.72)",
            fontSize: "0.92rem",
          }}
        >
          {marketingLinks.map((item) => (
            <Box
              key={item.path}
              component="button"
              onClick={() => onNavigate(item.path)}
              sx={{
                ...navButtonSx,
                color: currentPath === item.path ? "white" : "inherit",
              }}
            >
              {item.label}
            </Box>
          ))}
        </Stack>
        <Button
          variant="contained"
          onClick={() => onNavigate("/demo")}
          sx={{
            borderRadius: 999,
            px: 2.6,
            bgcolor: "#7c5cff",
            "&:hover": { bgcolor: "#6548d9" },
          }}
        >
          View Demo
        </Button>
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.92fr 1.08fr" },
          gap: { xs: 4, md: 7 },
          alignItems: "center",
          minHeight: { xs: "calc(100dvh - 84px)", md: "calc(100dvh - 116px)" },
          px: { xs: 2, sm: 4, md: 8 },
          pb: { xs: 4, md: 7 },
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <Typography sx={{ color: "#a8efe0", fontWeight: 800 }}>
            Reusable React storefront components
          </Typography>
          <Typography
            component="h1"
            sx={{
              maxWidth: 680,
              fontSize: { xs: "2.7rem", sm: "4.4rem", md: "5.6rem" },
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: 0,
            }}
          >
            A reusable storefront UI kit for React developers.
          </Typography>
          <Typography
            sx={{
              maxWidth: 560,
              color: "rgba(255,255,255,0.68)",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.75,
            }}
          >
            A polished React e-commerce kit with product cards, responsive
            filters, wishlist, cart, checkout steps, order complete flow,
            product detail pages, and quick-view image galleries.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <Button
              variant="contained"
              onClick={() => onNavigate("/demo")}
              sx={{
                width: { xs: "100%", sm: "auto" },
                borderRadius: 999,
                px: 3,
                py: 1.35,
                bgcolor: "#7c5cff",
                "&:hover": { bgcolor: "#6548d9" },
              }}
            >
              Preview the storefront
            </Button>
            <Button
              variant="outlined"
              onClick={() => onNavigate("/explore-the-kit")}
              sx={{
                width: { xs: "100%", sm: "auto" },
                borderRadius: 999,
                px: 3,
                py: 1.35,
                color: "white",
                borderColor: "rgba(255,255,255,0.45)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.72)",
                  bgcolor: "rgba(124,92,255,0.18)",
                },
              }}
            >
              Explore the kit
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {[
              "Product cards",
              "Filters",
              "Wishlist",
              "Cart",
              "Checkout",
              "Product page",
              "Quick view",
            ].map(
              (label) => (
                <Chip
                  key={label}
                  label={label}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              )
            )}
          </Stack>
        </Stack>
        <HeroPreview products={sampleProducts.slice(0, 3)} />
      </Box>
    </Box>
  );
}

function MarketingPage({ path, onNavigate }) {
  const knownPath = marketingLinks.some((item) => item.path === path);
  const pagePath = knownPath ? path : "/explore-the-kit";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f2ec", color: "#20201d" }}>
      <MarketingTopBar currentPath={pagePath} onNavigate={onNavigate} />
      {pagePath === "/explore-the-kit" && <ExploreKitPage onNavigate={onNavigate} />}
      {pagePath === "/components" && <ComponentsPage />}
      {pagePath === "/docs" && <DocsPage />}
    </Box>
  );
}

function MarketingTopBar({ currentPath, onNavigate }) {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        bgcolor: "rgba(244, 242, 236, 0.92)",
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
        <Box component="button" onClick={() => onNavigate("/")} sx={lightBrandButtonSx}>
          <BrandMark />
        </Box>
        <Stack direction="row" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
          {marketingLinks.map((item) => (
            <Button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              sx={{
                display: item.path === "/explore-the-kit" ? { xs: "none", md: "inline-flex" } : "inline-flex",
                minWidth: 0,
                px: { xs: 1, sm: 1.8 },
                borderRadius: 999,
                color: "#20201d",
                bgcolor:
                  currentPath === item.path ? "rgba(32,32,29,0.08)" : "transparent",
                "&:hover": { bgcolor: "rgba(32,32,29,0.12)" },
              }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant="contained"
            onClick={() => onNavigate("/demo")}
            sx={{
              ml: { xs: 0.5, sm: 1 },
              borderRadius: 999,
              bgcolor: "#20201d",
              "&:hover": { bgcolor: "#34342f" },
            }}
          >
            Demo
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

function ExploreKitPage({ onNavigate }) {
  return (
    <InfoShell
      eyebrow="Explore the kit"
      title="A sellable React storefront system, separated from the marketing site."
      body="The reusable product lives in src/ecommerce-kit. The surrounding pages are only for previewing, documenting, and selling the kit."
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Paper sx={infoPanelSx}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            What buyers get
          </Typography>
          <FeatureList
            items={[
              "Copyable product card and product grid components",
              "Accordion filters with mobile filter modal",
              "Quick-view modal with product image navigation",
              "Wishlist and cart hooks powered by localStorage",
              "Cart, checkout details, order complete, wishlist, and product detail templates",
              "Clean mock product data and a documented public export file",
            ]}
          />
        </Paper>
        <Paper sx={infoPanelSx}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            Preview workflow
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
            Use the demo route to test the complete storefront experience. Use the
            components and docs routes to explain what is included before a buyer
            downloads the files.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
            <Button variant="contained" onClick={() => onNavigate("/demo")} sx={darkButtonSx}>
              Open store demo
            </Button>
            <Button
              variant="outlined"
              onClick={() => onNavigate("/components")}
              sx={outlineButtonSx}
            >
              View components
            </Button>
          </Stack>
        </Paper>
      </Box>
    </InfoShell>
  );
}

function ComponentsPage() {
  const [tab, setTab] = useState("cards");
  const activeTab = componentTabs.find((item) => item.value === tab) ?? componentTabs[0];

  return (
    <InfoShell
      eyebrow="Components"
      title="Reusable pieces explained by feature."
      body="Each tab describes one part of the kit, the reusable props it expects, and how a buyer can adapt it inside another React project."
    >
      <Paper sx={{ ...infoPanelSx, p: { xs: 1.5, md: 2 } }}>
        <Tabs
          value={tab}
          onChange={(_, nextTab) => setTab(nextTab)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              borderRadius: 999,
              minHeight: 44,
              px: 2,
              fontWeight: 900,
              color: "#67675f",
            },
            "& .Mui-selected": { color: "#20201d" },
            "& .MuiTabs-indicator": {
              height: "100%",
              borderRadius: 999,
              bgcolor: "rgba(32,32,29,0.08)",
              zIndex: 0,
            },
          }}
        >
          {componentTabs.map((item) => (
            <Tab key={item.value} value={item.value} label={item.label} />
          ))}
        </Tabs>
        <Box sx={{ p: { xs: 1, md: 2 } }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            {activeTab.title}
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
            {activeTab.body}
          </Typography>
          <FeatureList items={activeTab.points} />
        </Box>
      </Paper>
    </InfoShell>
  );
}

function DocsPage() {
  return (
    <InfoShell
      eyebrow="Docs"
      title="How to send, install, and reuse the files."
      body="These docs explain the delivery structure for buyers and how to copy the reusable kit into another React project."
    >
      <Box sx={{ display: "grid", gap: 3 }}>
        <Paper sx={infoPanelSx}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            Recommended delivery
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
            After downloading the kit, unzip the project, run npm install, then
            npm run dev to preview the storefront locally. The reusable product
            you copy into your own React app is the src/ecommerce-kit folder.
            The src/demo folder is included as a live preview and documentation
            shell so you can see how the components work together before you
            integrate them.
          </Typography>
        </Paper>
        <Paper sx={infoPanelSx}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            File structure
          </Typography>
          <Box component="pre" sx={codeBlockSx}>
{`src/
  ecommerce-kit/
    components/
    hooks/
    templates/
    data/
    index.js
  demo/
    DemoPage.jsx`}
          </Box>
        </Paper>
        <Paper sx={infoPanelSx}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            Usage
          </Typography>
          <Box component="pre" sx={codeBlockSx}>
{`import {
  ProductListingPage,
  CartPage,
  useCart,
  useWishlist,
  sampleProducts,
} from "./ecommerce-kit";`}
          </Box>
          <FeatureList
            items={[
              "Replace sampleProducts with real product data using the same field shape.",
              "Keep wishlist and cart keys unique if a project has multiple stores.",
              "Customize colors through MUI theme values or component sx overrides.",
              "Use templates for fast setup, or import lower-level components for custom pages.",
            ]}
          />
        </Paper>
      </Box>
    </InfoShell>
  );
}

function InfoShell({ eyebrow, title, body, children }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Typography
          sx={{
            color: "#1f6f5b",
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
            maxWidth: 880,
            fontSize: { xs: "2.4rem", md: "4.1rem" },
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 0,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ maxWidth: 780, color: "text.secondary", lineHeight: 1.75 }}>
          {body}
        </Typography>
      </Stack>
      {children}
    </Container>
  );
}

function FeatureList({ items }) {
  return (
    <Stack gap={1.4}>
      {items.map((item) => (
        <Stack key={item} direction="row" gap={1.2} alignItems="flex-start">
          <Box
            sx={{
              mt: 0.8,
              width: 8,
              height: 8,
              flex: "0 0 auto",
              borderRadius: "3px",
              bgcolor: "#1f6f5b",
            }}
          />
          <Typography sx={{ color: "text.secondary", lineHeight: 1.65 }}>
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}


function HeroPreview({ products }) {
  const cardLayouts = [
    {
      left: "0%",
      top: "120px",
      width: "34%",
      rotate: "-5deg",
      zIndex: 1,
    },
    {
      left: "30%",
      top: "210px",
      width: "31%",
      rotate: "3deg",
      zIndex: 0,
    },
    {
      right: "0%",
      top: "265px",
      width: "31%",
      rotate: "6deg",
      zIndex: 0,
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        display: { xs: "grid", md: "block" },
        gap: { xs: 2.5, md: 0 },
        minHeight: { xs: "auto", md: 600 },
      }}
    >
      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          inset: { md: "0 0 0 0" },
          order: { xs: 2, md: 1 },
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: { xs: 1, sm: 2 },
          height: { md: "100%" },
        }}
      >
        {products.map((product, index) => {
          const layout = cardLayouts[index] ?? cardLayouts[0];

          return (
          <Box
            key={product.id}
            sx={{
              position: { xs: "relative", md: "absolute" },
              left: { md: layout.left },
              right: { md: layout.right },
              top: { md: layout.top },
              zIndex: { md: layout.zIndex },
              width: { xs: "auto", md: layout.width },
              mt: index === 1 ? { xs: 2, md: 0 } : index === 2 ? { xs: 0.5, md: 0 } : 0,
              p: { xs: 0.75, sm: 1 },
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.92)",
              color: "#20201d",
              boxShadow: "0 26px 70px rgba(0,0,0,0.28)",
              transform: { md: `rotate(${layout.rotate})` },
              transformOrigin: "center",
            }}
          >
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: "100%",
                aspectRatio: "4 / 5",
                objectFit: "cover",
                borderRadius: 1.25,
              }}
            />
            <Box sx={{ p: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: "0.68rem", md: "0.86rem" },
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </Typography>
              <Typography
                sx={{
                  color: "#6f6a62",
                  fontSize: { xs: "0.66rem", md: "0.8rem" },
                  fontWeight: 800,
                }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          right: { md: 10 },
          top: { md: 28 },
          order: { xs: 1, md: 2 },
          zIndex: 3,
          width: "100%",
          maxWidth: { xs: "none", md: 390 },
          p: { xs: 2.25, md: 3 },
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.24)",
        }}
      >
        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem" }}>
          What is included
        </Typography>
        <Stack
          gap={1.2}
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "1fr" },
          }}
        >
          {[
            "Product cards and grid",
            "Responsive filters",
            "Wishlist and cart logic",
            "Quick-view image gallery",
            "Product detail page",
            "Checkout and order steps",
          ].map(
            (item) => (
              <Stack key={item} direction="row" alignItems="center" gap={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: "3px", bgcolor: "#a8efe0" }} />
                <Typography sx={{ fontWeight: 900, fontSize: { xs: "0.84rem", md: "0.96rem" } }}>
                  {item}
                </Typography>
              </Stack>
            )
          )}
        </Stack>
        <Divider sx={{ my: 2.25, borderColor: "rgba(255,255,255,0.18)" }} />
        <Typography
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontSize: { xs: "0.86rem", md: "0.94rem" },
            lineHeight: 1.7,
          }}
        >
          Includes reusable React components, hooks, mock data, localStorage examples,
          and a working storefront demo buyers can study or copy from.
        </Typography>
      </Box>
    </Box>
  );
}

function BrandMark() {
  return (
    <Stack direction="row" alignItems="center" gap={1.25}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 10px)", gap: "3px" }}>
        {["#7c5cff", "#1f6f5b", "#f2c94c", "#f15c84"].map((color) => (
          <Box key={color} sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: color }} />
        ))}
      </Box>
      <Typography sx={{ fontWeight: 900, letterSpacing: 0 }}>CommerceKit</Typography>
    </Stack>
  );
}

function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  return ["/", "/demo", "/explore-the-kit", "/components", "/docs"].includes(cleanPath)
    ? cleanPath
    : "/explore-the-kit";
}

const marketingLinks = [
  { path: "/explore-the-kit", label: "Explore" },
  { path: "/components", label: "Components" },
  { path: "/docs", label: "Docs" },
];

const componentTabs = [
  {
    value: "cards",
    label: "Cards",
    title: "ProductCard and ProductGrid",
    body: "ProductCard handles the reusable product preview. ProductGrid arranges cards into a responsive catalog and passes wishlist, cart, and quick-view handlers down cleanly.",
    points: [
      "Accepts product data, currency, wishlist state, cart state, and click handlers.",
      "Includes hover overlay, image zoom, quick-view CTA, and wishlist toggle behavior.",
      "Keeps layout responsive so product images stay balanced on smaller screens.",
    ],
  },
  {
    value: "filters",
    label: "Filters",
    title: "Accordion Filters",
    body: "Filters supports categories, multi-select sizes, multi-select colors, and a clear button. On the listing template it becomes a modal on smaller screens.",
    points: [
      "Controlled props make it easy to connect to any product data source.",
      "Accordion groups keep the sidebar compact and buyer-friendly.",
      "The clear filters action resets all selected categories, sizes, and colors.",
    ],
  },
  {
    value: "quick-view",
    label: "Quick View",
    title: "ProductOptionsDialog",
    body: "The quick-view dialog lets users inspect images, choose variants, adjust quantity, wishlist the product, and add it to cart without leaving the listing.",
    points: [
      "Supports image arrows, dots, previous and next product navigation, and responsive modal layout.",
      "Accepts dynamic product images, colors, sizes, SKU, category, and tags.",
      "Uses clear callbacks for add-to-cart and wishlist actions.",
    ],
  },
  {
    value: "state",
    label: "State Hooks",
    title: "Wishlist, Cart, Filters, and Pagination Hooks",
    body: "Reusable hooks keep business logic separate from UI so buyers can reuse the same components with their own pages or API data.",
    points: [
      "useWishlist stores liked product IDs in localStorage.",
      "useCart stores cart items, quantities, selected size, and selected color in localStorage.",
      "useProductFilters and usePagination keep listing behavior predictable and copyable.",
    ],
  },
  {
    value: "templates",
    label: "Templates",
    title: "Storefront Page Templates",
    body: "Templates compose the smaller components into ready-to-use pages for products, cart, checkout, wishlist, and product detail.",
    points: [
      "ProductListingPage combines filters, grid, pagination, and quick-view entry points.",
      "CartPage includes shopping cart, checkout details, and order complete steps.",
      "WishlistPage and ProductDetailPage are reusable starting points for full store pages.",
    ],
  },
];

const navButtonSx = {
  p: 0,
  border: 0,
  bgcolor: "transparent",
  color: "inherit",
  font: "inherit",
  cursor: "pointer",
  transition: "color 160ms ease",
  "&:hover": { color: "white" },
};

const lightBrandButtonSx = {
  p: 0,
  border: 0,
  bgcolor: "transparent",
  color: "#20201d",
  font: "inherit",
  cursor: "pointer",
};

const darkButtonSx = {
  borderRadius: 999,
  bgcolor: "#20201d",
  px: 2.6,
  py: 1.2,
  "&:hover": { bgcolor: "#34342f" },
};

const outlineButtonSx = {
  borderRadius: 999,
  borderColor: "#20201d",
  color: "#20201d",
  px: 2.6,
  py: 1.2,
  "&:hover": {
    borderColor: "#34342f",
    bgcolor: "rgba(32,32,29,0.06)",
  },
};

const infoPanelSx = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 4,
  border: "1px solid #e1d9ce",
  bgcolor: "rgba(255,255,255,0.72)",
  boxShadow: "0 24px 70px rgba(32, 32, 29, 0.08)",
};

const codeBlockSx = {
  m: 0,
  mb: 2,
  p: 2,
  overflowX: "auto",
  borderRadius: 3,
  bgcolor: "#20201d",
  color: "#f4f2ec",
  fontSize: "0.9rem",
  lineHeight: 1.7,
};
