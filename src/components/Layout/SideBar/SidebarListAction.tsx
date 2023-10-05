import { CircularProgress, IconButton, Popover, Stack } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BoxClickAble from "~/components/Common/BoxClickAble";
import { api } from "~/utils/api";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useRouter } from "next/router";

interface IProps {
  id: string;
  handleReloadData: () => Promise<void>;
}

const SidebarListAction = (props: IProps) => {
  const { id, handleReloadData } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { mutateAsync: deletePage, isLoading: deleteLoading } =
    api.page.deletePageById.useMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDelete = async () => {
    await deletePage({ id: id });
    void handleReloadData();
    void router.replace("/");
    setAnchorEl(null);
  };

  const handleOpenPopper = (ref: HTMLElement) => {
    setAnchorEl(ref);
  };

  return (
    <>
      <IconButton
        sx={{ bgcolor: "transparent !important" }}
        size="small"
        onClick={(e) => {
          handleOpenPopper(e.currentTarget);
        }}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        elevation={5}
        PaperProps={{ sx: { borderColor: (theme) => theme.palette.background.paper } }}
      >
        <Stack direction="row">
          <BoxClickAble
            disabled={deleteLoading}
            onClick={() => void handleDelete()}
          >
            {deleteLoading && (
              <CircularProgress
                size="16px"
                sx={{ color: (theme) => theme.palette.text.primary, mr: 1 }}
              />
            )}

            {t("deletePage")}
          </BoxClickAble>
        </Stack>
      </Popover>
    </>
  );
};

export default SidebarListAction;
