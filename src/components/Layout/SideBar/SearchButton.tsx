import SearchIcon from "@mui/icons-material/Search";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BoxClickAble from "~/components/Common/BoxClickAble";
import SearchDialog from "~/components/Dialog/SearchDialog/SearchDialog";

const SearchButton = () => {
  const { t } = useTranslation();
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  return (
    <>
      <BoxClickAble
        sx={{
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
        }}
        onClick={() => setOpenSearchDialog(true)}
      >
        <SearchIcon fontSize="small" />
        <Typography variant="body2">{t("search")}</Typography>
      </BoxClickAble>
      <SearchDialog
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
      />
    </>
  );
};

export default SearchButton;
