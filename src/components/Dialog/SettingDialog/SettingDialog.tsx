import { Dialog, Stack, Tab, Tabs, useMediaQuery } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AccountTab from "./AccountTab";
import SettingTab from "./SettingTab";
import ChangePasswordTab from "./ChangePasswordTab";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const SettingDialog = (props: IProps) => {
  const { open, onClose } = props;
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [tab, setTab] = useState(0);
  const settingOption = useMemo(() => {
    return [
      {
        value: 0,
        label: t("myAcc"),
      },
      {
        value: 1,
        label: t("mySetting"),
      },
      {
        value: 2,
        label: t("changePassword"),
      },
    ];
  }, [t]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { minHeight: "320px" },
      }}
      TransitionProps={{
        onExited: () => {
          setTab(0);
        },
      }}
    >
      <Stack direction={isMobile ? "column" : "row"}>
        <Stack direction="column" p={2}>
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            value={tab}
            onChange={handleChangeTab}
            sx={{
              borderRight: 1,
              borderColor: isMobile ? "transparent" : "divider",
            }}
          >
            {settingOption.map((item) => (
              <Tab key={item.value} label={item.label} />
            ))}
          </Tabs>
        </Stack>

        {tab === 0 && <AccountTab />}

        {tab === 1 && <SettingTab />}

        {tab === 2 && <ChangePasswordTab onClose={onClose} />}
      </Stack>
    </Dialog>
  );
};

export default SettingDialog;
