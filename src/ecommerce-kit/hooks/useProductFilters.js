import { useMemo, useState } from "react";

const initialFilters = {
  categories: [],
  sizes: [],
  colors: [],
};

// Used by each multi-select filter group.
function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function useProductFilters(products, defaultFilters = initialFilters) {
  const [filters, setFilters] = useState({
    ...initialFilters,
    ...defaultFilters,
  });

  const filteredProducts = useMemo(() => {
    // Empty filter arrays mean "show all" for that filter group.
    return products.filter((product) => {
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const matchesSize =
        filters.sizes.length === 0 ||
        product.sizes.some((size) => filters.sizes.includes(size));

      const matchesColor =
        filters.colors.length === 0 ||
        product.colors.some((color) => filters.colors.includes(color));

      return matchesCategory && matchesSize && matchesColor;
    });
  }, [filters, products]);

  const toggleFilter = (filterName, value) => {
    // filterName should be one of: "categories", "sizes", or "colors".
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: toggleValue(currentFilters[filterName], value),
    }));
  };

  const clearFilters = () => setFilters(initialFilters);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0;

  return {
    filters,
    filteredProducts,
    hasActiveFilters,
    toggleFilter,
    clearFilters,
  };
}
