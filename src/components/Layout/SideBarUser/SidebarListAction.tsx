import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { CircularProgress, IconButton, Popover, Stack } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BoxClickAble from "~/components/Common/BoxClickAble";
import SettingPermissionDialog from "~/components/Dialog/SettingPermissionDialog/SettingPermissionDialog";
import { api } from "~/utils/api";
import { handleUnauthorize } from "~/utils/constant";

interface IProps {
  id: string;
  handleReloadData: () => Promise<void>;
  authorId: string;
}

const SidebarListAction = (props: IProps) => {
  const { id, handleReloadData, authorId } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { mutateAsync: deletePage, isLoading: deleteLoading } =
    api.page.deletePageById.useMutation({
      onError: (err) =>
        handleUnauthorize(getTRPCErrorFromUnknown(err).code, router),
    });
  const { data: currUser } = api.user.getCurrUserDetail.useQuery();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [permissionDialog, setPermissionDialog] = useState(false);

  const handleDelete = async () => {
    await deletePage({ id: id });
    await handleReloadData();
    void router.replace("/");
    setAnchorEl(null);
  };

  const handleOpenPermission = () => {
    setPermissionDialog(true);
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
        disabled={currUser?.id !== authorId}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        elevation={5}
        PaperProps={{
          sx: { borderColor: (theme) => theme.palette.background.paper },
        }}
      >
        <Stack direction="column">
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

          <BoxClickAble disabled={deleteLoading} onClick={handleOpenPermission}>
            {t("settingPermission")}
          </BoxClickAble>
        </Stack>
      </Popover>

      <SettingPermissionDialog
        open={permissionDialog}
        onClose={() => setPermissionDialog(false)}
        id={id}
      />
    </>
  );
};

export default SidebarListAction;
