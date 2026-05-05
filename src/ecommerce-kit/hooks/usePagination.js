import { useEffect, useMemo, useState } from "react";

// Use this pagination helper for product lists or any other array of items.
export function usePagination(items, itemsPerPage = 8) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    // Keep the current page valid when filters reduce the number of pages.
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, items, itemsPerPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), pageCount));
  };

  return {
    currentPage,
    pageCount,
    paginatedItems,
    goToPage,
    setCurrentPage: goToPage,
  };
}
