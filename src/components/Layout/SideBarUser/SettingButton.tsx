import SettingsIcon from "@mui/icons-material/Settings";
import { Typography } from "@mui/material";
import { useState } from "react";
import BoxClickAble from "~/components/Common/BoxClickAble";
import SettingDialog from "~/components/Dialog/SettingDialog/SettingDialog";
import { useTranslation } from "react-i18next";

const SettingButton = () => {
  const { t } = useTranslation();
  const [openSettingDialog, setOpenSettingDialog] = useState(false);

  return (
    <>
      <BoxClickAble
        sx={{
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
        }}
        onClick={() => setOpenSettingDialog(true)}
      >
        <SettingsIcon fontSize="small" />
        <Typography variant="body2">{t("setting")}</Typography>
      </BoxClickAble>

      <SettingDialog
        open={openSettingDialog}
        onClose={() => setOpenSettingDialog(false)}
      />
    </>
  );
};

export default SettingButton;
