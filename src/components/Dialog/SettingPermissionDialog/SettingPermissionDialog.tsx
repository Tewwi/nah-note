import { Dialog, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "simplebar-react/dist/simplebar.min.css";
import useGetPageDetail from "~/hook/useGetPageDetail";
import AddPermissionTab from "./AddPermissionTab";
import EditPermissionTab from "./EditPermissionTab";
import PermissionTab from "./PermissionTab";

interface IProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

const SettingPermissionDialog = (props: IProps) => {
  const { open, onClose, id } = props;
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);

  const { data: pageData, refetch } = useGetPageDetail(id?.toString() || "");

  const settingOption = useMemo(() => {
    return [
      {
        value: 0,
        label: t("general"),
      },
      {
        value: 1,
        label: t("add"),
      },
      {
        value: 2,
        label: t("edit"),
      },
    ];
  }, [t]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleRefetch = () => {
    void refetch();
  };

  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minHeight: "320px",
          p: 1,
          minWidth: "400px",
        },
      }}
      TransitionProps={{
        onExited: () => {
          setTab(0);
          void refetch();
        },
      }}
    >
      <DialogTitle>{t("settingPermission")}</DialogTitle>
      <DialogContent>
        <Tabs
          orientation={"horizontal"}
          value={tab}
          onChange={handleChangeTab}
          sx={{
            mb: 1,
          }}
        >
          {settingOption.map((item) => (
            <Tab key={item.value} label={item.label} />
          ))}
        </Tabs>

        {tab === 0 ? (
          <PermissionTab pageData={pageData} handleRefetch={handleRefetch} />
        ) : null}

        {tab === 1 ? (
          <AddPermissionTab pageData={pageData} onClose={onClose} />
        ) : null}

        {tab === 2 ? (
          <EditPermissionTab pageData={pageData} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default SettingPermissionDialog;
