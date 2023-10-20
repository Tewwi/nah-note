import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface IProps {
  page: number;
  handleChangePage: (page: number) => void;
  totalPage: number;
}

const Pagination = (props: IProps) => {
  const { page, handleChangePage, totalPage } = props;

  const handleNextPage = () => {
    if (page === totalPage) {
      return;
    }

    handleChangePage(page + 1);
  };

  const handlePrevPage = () => {
    if (page === 1) {
      return;
    }

    handleChangePage(page - 1);
  };

  return (
    <Stack
      direction="row"
      sx={{ alignItems: "center", justifyContent: "center", pt: 1, gap: 1 }}
    >
      <IconButton disabled={page === 1} onClick={handlePrevPage}>
        <KeyboardArrowLeftIcon fontSize="small" />
      </IconButton>

      <Typography variant="body2">{`Page ${page} in ${totalPage}`}</Typography>

      <IconButton disabled={page === totalPage} onClick={handleNextPage}>
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

export default Pagination;
