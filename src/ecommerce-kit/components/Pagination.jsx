import { Button, Stack, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Use this as a simple previous/next pagination control.
// Keep the state in your parent with usePagination so you can scroll or fetch data.
export function Pagination({ currentPage, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<ChevronLeftIcon />}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={paginationButtonSx}
      >
        Previous
      </Button>
      <Typography sx={{ minWidth: 96, textAlign: "center" }}>
        {currentPage} of {pageCount}
      </Typography>
      <Button
        variant="outlined"
        color="inherit"
        endIcon={<ChevronRightIcon />}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        sx={paginationButtonSx}
      >
        Next
      </Button>
    </Stack>
  );
}

const paginationButtonSx = {
  borderRadius: 999,
  px: 2.2,
  borderColor: "#20201d",
  color: "#20201d",
  "&:hover": {
    borderColor: "#34342f",
    bgcolor: "rgba(32, 32, 29, 0.06)",
  },
};
