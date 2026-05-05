import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// Use this full cart and checkout template when you need a complete purchase flow.
// Keep checkoutStep in your parent so you can sync the step with routing if needed.
export function CartPage({
  checkoutStep = 1,
  onCheckoutStepChange,
  cartProducts,
  cartTotal,
  onUpdateQuantity,
  onRemove,
  onClearCart,
  onContinue,
}) {
  const discount = cartTotal * 0.2;
  const deliveryFee = cartProducts.length ? 15 : 0;
  // Replace this sample discount/fee logic with your real business rules.
  const total = Math.max(0, cartTotal - discount + deliveryFee);

  const goBack = () => onCheckoutStepChange?.(Math.max(1, checkoutStep - 1));

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        component="h1"
        sx={{
          mb: 4,
          textAlign: "center",
          fontSize: { xs: "2.2rem", md: "3rem" },
          fontWeight: 900,
          letterSpacing: 0,
        }}
      >
        Your Shopping Cart
      </Typography>

      <CheckoutSteps activeStep={checkoutStep} />

      {checkoutStep > 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            sx={outlineButtonSx}
          >
            Back to {checkoutStep === 2 ? "cart" : "checkout details"}
          </Button>
        </Box>
      )}

      {checkoutStep === 1 && (
        // Use step 1 for cart line items plus the order summary.
        <Box sx={cartGridSx}>
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                Your cart
              </Typography>
              <Button
                variant="outlined"
                onClick={onClearCart}
                disabled={!cartProducts.length}
                sx={outlineButtonSx}
              >
                Clear all
              </Button>
            </Stack>
            <Box sx={cartPanelSx}>
              {cartProducts.length === 0 ? (
                <EmptyState
                  title="Your cart is empty"
                  body="Add a product from the storefront demo to preview the cart and checkout flow."
                  action="Continue shopping"
                  onAction={onContinue}
                />
              ) : (
                cartProducts.map((item, index) => (
                  <CartLine
                    key={`${item.productId}-${item.size}-${item.color}`}
                    item={item}
                    showDivider={index < cartProducts.length - 1}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                ))
              )}
            </Box>
          </Box>

          <OrderSummary
            cartProducts={cartProducts}
            cartTotal={cartTotal}
            discount={discount}
            deliveryFee={deliveryFee}
            total={total}
            buttonLabel="Go to Checkout"
            onSubmit={() => onCheckoutStepChange?.(2)}
          />
        </Box>
      )}

      {checkoutStep === 2 && (
        // Use step 2 for the checkout form plus the same order summary.
        <Box sx={{ ...cartGridSx, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.2fr) 0.8fr" }, mt: { xs: 3, md: 3 } }}>
          <CheckoutDetailsForm />
          <OrderSummary
            cartProducts={cartProducts}
            cartTotal={cartTotal}
            discount={discount}
            deliveryFee={deliveryFee}
            total={total}
            buttonLabel="Complete Order"
            onSubmit={() => onCheckoutStepChange?.(3)}
          />
        </Box>
      )}

      {checkoutStep === 3 && (
        // Use step 3 for the order completion state.
        <OrderComplete
          total={total}
          onContinue={() => {
            onClearCart?.();
            onCheckoutStepChange?.(1);
            onContinue?.();
          }}
        />
      )}
    </Container>
  );
}

function OrderSummary({
  cartProducts,
  cartTotal,
  discount,
  deliveryFee,
  total,
  buttonLabel,
  onSubmit,
}) {
  return (
    <Box sx={summaryPanelSx}>
      <Typography sx={{ fontWeight: 900, mb: 2 }}>Order Summary</Typography>
      <Stack direction="row" gap={1} sx={{ mb: 2 }}>
        <Box sx={couponSx}>Coupon Code</Box>
        <Button sx={blackButtonSx}>Apply</Button>
      </Stack>
      <SummaryRow label="Subtotal" value={`$${cartTotal.toFixed(2)}`} />
      <SummaryRow label="Discount (-20%)" value={`-$${discount.toFixed(2)}`} danger />
      <SummaryRow label="Delivery Fee" value={`$${deliveryFee.toFixed(2)}`} />
      <Divider sx={{ my: 2 }} />
      <SummaryRow label="Total" value={`$${total.toFixed(2)}`} total />
      <Button
        fullWidth
        disabled={!cartProducts.length}
        onClick={onSubmit}
        sx={{ ...blackButtonSx, mt: 2, py: 1.4, width: "100%" }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
}

function CheckoutDetailsForm() {
  // Wire this presentational form to your form library or backend checkout.
  return (
    <Box sx={cartPanelSx}>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
        Checkout details
      </Typography>
      <Box
        component="form"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {[
          ["First name", "text"],
          ["Last name", "text"],
          ["Email", "email"],
          ["Phone", "tel"],
          ["City", "text"],
          ["Postal code", "text"],
        ].map(([label, type]) => (
          <TextField key={label} label={label} type={type} fullWidth sx={fieldSx} />
        ))}
        <TextField
          label="Street address"
          fullWidth
          sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
        />
        <TextField
          label="Order notes"
          multiline
          minRows={4}
          fullWidth
          sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
        />
      </Box>
    </Box>
  );
}

function OrderComplete({ total, onContinue }) {
  return (
    <Box sx={{ ...summaryPanelSx, maxWidth: 680, mx: "auto", mt: { xs: 4, md: 6 }, textAlign: "center" }}>
      <Box sx={completeIconSx}>✓</Box>
      <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 0 }}>
        Order complete
      </Typography>
      <Typography sx={{ mt: 1, color: "text.secondary" }}>
        The checkout template is complete. This demo order total was ${total.toFixed(2)}.
      </Typography>
      <Button variant="contained" onClick={onContinue} sx={{ ...blackButtonSx, mt: 3 }}>
        Continue shopping
      </Button>
    </Box>
  );
}

function CheckoutSteps({ activeStep }) {
  return (
    <Box sx={stepsGridSx}>
      {["Shopping cart", "Checkout details", "Order complete"].map((label, index) => (
        <Stack
          key={label}
          alignItems="center"
          gap={1}
          sx={{ minWidth: 0, opacity: index + 1 <= activeStep ? 1 : 0.62 }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" gap={{ xs: 0.75, sm: 1.25 }} sx={{ width: "100%", minWidth: 0 }}>
            <Box sx={{ ...stepNumberSx, bgcolor: index + 1 <= activeStep ? "#20201d" : "#b7bccb" }}>
              {index + 1}
            </Box>
            <Typography sx={{ color: index + 1 <= activeStep ? "#20201d" : "#9b9b9b", fontSize: { xs: "0.72rem", sm: "0.9rem", md: "1rem" }, lineHeight: 1.15, textAlign: "center", overflowWrap: "anywhere" }}>
              {label}
            </Typography>
          </Stack>
          {index + 1 === activeStep && <Box sx={{ width: "100%", maxWidth: 220, borderTop: "2px solid #20201d" }} />}
        </Stack>
      ))}
    </Box>
  );
}

function CartLine({ item, showDivider, onUpdateQuantity, onRemove }) {
  return (
    <Box>
      <Box sx={cartLineSx}>
        <Box component="img" src={item.product.image} alt={item.product.name} sx={cartImageSx} />
        <Box>
          <Typography sx={{ fontWeight: 900 }}>{item.product.name}</Typography>
          <Typography sx={mutedTextSx}>Size: {item.size}</Typography>
          <Typography sx={mutedTextSx}>Color: {item.color}</Typography>
          <Typography sx={{ mt: 2, fontWeight: 900 }}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <QuantityControl
            quantity={item.quantity}
            onDecrease={() => onUpdateQuantity?.({ ...item, quantity: item.quantity - 1 })}
            onIncrease={() => onUpdateQuantity?.({ ...item, quantity: item.quantity + 1 })}
          />
          <IconButton color="error" onClick={() => onRemove?.(item)}>
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </Box>
      {showDivider && <Divider />}
    </Box>
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

function SummaryRow({ label, value, danger = false, total = false }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.8 }}>
      <Typography sx={{ color: total ? "#20201d" : "text.secondary" }}>{label}</Typography>
      <Typography sx={{ color: danger ? "#d13d3d" : "#20201d", fontSize: total ? "1.25rem" : "1rem", fontWeight: 900 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function EmptyState({ title, body, action, onAction }) {
  return (
    <Box sx={emptySx}>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>{title}</Typography>
      <Typography sx={{ mt: 1, mb: 3, color: "text.secondary" }}>{body}</Typography>
      <Button variant="contained" onClick={onAction} sx={blackButtonSx}>
        {action}
      </Button>
    </Box>
  );
}

const cartGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.45fr) 0.95fr" },
  gap: 3,
  mt: { xs: 4, md: 6 },
  alignItems: "start",
};

const cartPanelSx = {
  p: { xs: 2, md: 3 },
  border: "1px solid #ded8ce",
  borderRadius: 4,
  bgcolor: "rgba(255,255,255,0.72)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)",
};

const summaryPanelSx = {
  p: { xs: 2.5, md: 3 },
  border: "1px solid #ded8ce",
  borderRadius: 4,
  bgcolor: "rgba(255,255,255,0.78)",
  boxShadow: "0 24px 60px rgba(32, 32, 29, 0.12)",
};

const outlineButtonSx = {
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

const blackButtonSx = {
  borderRadius: 999,
  px: 3,
  bgcolor: "#20201d",
  color: "white",
  fontWeight: 900,
  "&:hover": { bgcolor: "#34342f" },
  "&.Mui-disabled": { bgcolor: "#d7d1c8", color: "#7a746b" },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "rgba(255,255,255,0.7)",
    "&.Mui-focused fieldset": { borderColor: "#20201d" },
    "&:hover fieldset": { borderColor: "#20201d" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#20201d" },
};

const couponSx = {
  flex: 1,
  px: 2,
  py: 1.2,
  borderRadius: 999,
  bgcolor: "#efede8",
  color: "text.secondary",
  fontSize: "0.9rem",
};

const completeIconSx = {
  width: 72,
  height: 72,
  mx: "auto",
  mb: 2,
  display: "grid",
  placeItems: "center",
  borderRadius: "24px",
  bgcolor: "#20201d",
  color: "white",
  fontSize: "2rem",
  fontWeight: 900,
};

const stepsGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: { xs: 1, sm: 2, md: 4 },
  maxWidth: 760,
  mx: "auto",
};

const stepNumberSx = {
  width: { xs: 46, sm: 38 },
  height: { xs: 46, sm: 38 },
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: { xs: "14px", sm: "12px" },
  color: "white",
  fontWeight: 900,
};

const cartLineSx = {
  display: "grid",
  gridTemplateColumns: { xs: "84px 1fr", sm: "116px 1fr auto" },
  gap: { xs: 1.5, sm: 2 },
  alignItems: "center",
  py: 2,
};

const cartImageSx = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: 2,
  bgcolor: "#efede8",
};

const mutedTextSx = { color: "text.secondary", fontSize: "0.9rem" };

const quantitySx = {
  minWidth: 116,
  height: 40,
  px: 1,
  borderRadius: 999,
  bgcolor: "#efede8",
};

const emptySx = {
  p: { xs: 4, md: 6 },
  border: "1px solid #e4ded4",
  borderRadius: 3,
  bgcolor: "rgba(255,255,255,0.74)",
  textAlign: "center",
};
