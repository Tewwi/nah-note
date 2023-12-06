import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Stack,
} from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { handleUnauthorize } from "~/utils/constant";
import SearchIcon from "@mui/icons-material/Search";
import { debounce, includes } from "lodash";
import PermissionUserItem from "./PermissionUserItem";
import toast from "react-hot-toast";
import type { User } from "@prisma/client";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface IProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

const SettingPermissionDialog = (props: IProps) => {
  const { open, onClose, id } = props;

  const router = useRouter();
  const { t } = useTranslation();

  const { data: pageData } = api.page.getPageById.useQuery({
    id: id,
  });
  const {
    data: userList,
    mutateAsync: searchUser,
    reset,
  } = api.user.searchUserByName.useMutation();
  const { mutateAsync: updatePermission } =
    api.page.setPermissionPage.useMutation({
      onError: (err) =>
        handleUnauthorize(getTRPCErrorFromUnknown(err).code, router),
    });

  const handleSearchUser = debounce(async (value: string) => {
    await searchUser({
      query: value,
      permissionList: pageData?.permissionId || [],
    });
  });

  const handleAddUser = async (userId: string) => {
    try {
      await updatePermission({ pageId: id, userIds: userId });
      onClose();
      toast.success(t("addSuccess"));
    } catch (error) {
      toast.error(getTRPCErrorFromUnknown(error).message);
    }
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
        onExit: () => {
          reset();
        },
      }}
    >
      <DialogTitle>{t("settingPermission")}</DialogTitle>
      <DialogContent>
        <Stack direction="column">
          <Stack direction="row" alignItems="center" mb={1}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={t("permissionPlaceholder")}
              onChange={(e) => {
                void handleSearchUser(e.target.value);
              }}
              endAdornment={
                <IconButton sx={{ p: "10px" }} aria-label="menu">
                  <SearchIcon />
                </IconButton>
              }
            />
          </Stack>
          <SimpleBar style={{ maxHeight: "240px" }}>
            <Stack direction="column" gap={1.5}>
              {userList
                ?.filter((item) => item.id !== pageData?.authorId)
                .map((user) => (
                  <PermissionUserItem
                    key={user.id}
                    handleAddUser={handleAddUser}
                    data={user as User}
                    hidden={includes(pageData?.permissionId, user.id)}
                  />
                ))}
            </Stack>
          </SimpleBar>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SettingPermissionDialog;
