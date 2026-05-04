import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// One accordion group for a multi-select filter section.
// Reuse it for categories, sizes, colors, or any custom option group.
function FilterGroup({ title, options, selectedValues, onChange }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        bgcolor: "transparent",
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 0,
          minHeight: 48,
          "& .MuiAccordionSummary-content": { my: 1 },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
        <FormGroup>
          {options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={selectedValues.includes(option)}
                  onChange={() => onChange(option)}
                  sx={{
                    color: "#b9b3a9",
                    "&.Mui-checked": { color: "#20201d" },
                    "&:hover": { bgcolor: "rgba(32, 32, 29, 0.08)" },
                  }}
                />
              }
              label={option}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.92rem",
                  color: "text.secondary",
                },
              }}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}

export function Filters({
  categories,
  sizes,
  colors,
  selectedCategories,
  selectedSizes,
  selectedColors,
  hasActiveFilters = false,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onClearFilters,
  hideTitle = false,
}) {
  return (
    <Box
      component="aside"
      sx={{
        display: "grid",
        alignContent: "start",
        gap: 3,
        minWidth: { md: 240 },
      }}
    >
      <Box>
        {!hideTitle && (
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Filters
          </Typography>
        )}
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          sx={{
            mt: 2,
            borderRadius: 999,
            borderColor: "#20201d",
            color: "#20201d",
            fontWeight: 800,
            "&:hover": {
              borderColor: "#34342f",
              bgcolor: "rgba(32, 32, 29, 0.08)",
            },
            "&.Mui-disabled": {
              borderColor: "#ded9d1",
              color: "#aaa39a",
            },
          }}
        >
          Clear filters
        </Button>
        <Divider sx={{ mt: 2 }} />
      </Box>

      <FilterGroup
        title="Category"
        options={categories}
        selectedValues={selectedCategories}
        onChange={onCategoryChange}
      />
      <FilterGroup
        title="Sizes"
        options={sizes}
        selectedValues={selectedSizes}
        onChange={onSizeChange}
      />
      <FilterGroup
        title="Colors"
        options={colors}
        selectedValues={selectedColors}
        onChange={onColorChange}
      />

    </Box>
  );
}
