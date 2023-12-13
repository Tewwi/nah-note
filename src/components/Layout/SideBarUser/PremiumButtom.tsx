import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BoxClickAble from "~/components/Common/BoxClickAble";
import PremiumDialog from "~/components/Dialog/PremiumDialog/PremiumDialog";

const PremiumButton = () => {
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
        <AutoAwesomeIcon fontSize="small" />
        <Typography variant="body2">{t("premiumText")}</Typography>
      </BoxClickAble>
      <PremiumDialog
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
      />
    </>
  );
};

export default PremiumButton;
