import {
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import type { Page } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import { api } from "~/utils/api";

const selectOption = [
  {
    value: 0,
    label: "limit",
    desc: "permissionLimitDesc",
  },
  {
    value: 1,
    label: "any",
    desc: "permissionAnyDesc",
  },
];

interface IProps {
  pageData?: Page | null;
  handleRefetch: () => void;
}

const PermissionTab = (props: IProps) => {
  const { pageData, handleRefetch } = props;
  const { t } = useTranslation();
  const { mutateAsync, isLoading } = api.page.setPublicPermission.useMutation();

  const [optionValue, setOptionValue] = useState(pageData?.isPublic ? 1 : 0);

  const descOption = selectOption.find((item) => item.value === optionValue);

  const handleCopyLink = () => {
    if (!window) {
      return;
    }

    const baseUrl = window.location.host;
    void navigator.clipboard.writeText(`${baseUrl}/page/${pageData?.id}`);
    toast.success(t("success"));
  };

  const handleChangeStatus = async (e: SelectChangeEvent<number>) => {
    if (pageData) {
      setOptionValue(Number(e.target.value));
      await mutateAsync({
        pageId: pageData.id,
        isPublic: Boolean(e.target.value),
      });
      handleRefetch();

      toast.success(t("success"));
    }
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center" gap={1.5} mt={2} mb={2}>
        <Typography variant="body1">{t("permissionGeneral")}</Typography>
        <Select
          value={optionValue}
          onChange={(e) => void handleChangeStatus(e)}
          input={<OutlinedInput />}
          inputProps={{ "aria-label": "Without label" }}
          disabled={isLoading}
          sx={{
            "& .MuiSelect-select": {
              padding: 1,
              pl: "14px",
              pr: "32px",
            },
            maxHeight: "40px",
            alignSelf: "center",
            minWidth: "120px",
          }}
        >
          {selectOption.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {t(item.label)}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: "280px" }}>
        {t(descOption?.desc || "")}
      </Typography>

      <LoadingButton
        title={t("copyLink")}
        variant="outlined"
        size="small"
        sx={{ mt: 2 }}
        onClick={handleCopyLink}
        loading={!Boolean(pageData)}
      />
    </Stack>
  );
};

export default PermissionTab;
