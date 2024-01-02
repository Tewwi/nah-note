import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Stack } from "@mui/material";
import type { Page, User } from "@prisma/client";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { debounce, includes } from "lodash";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { api } from "~/utils/api";
import { handleUnauthorize } from "~/utils/constant";
import PermissionUserItem from "./PermissionUserItem";

interface IProps {
  pageData?: Page | null;
  onClose: () => void;
}

const AddPermissionTab = (props: IProps) => {
  const { pageData, onClose } = props;
  const router = useRouter();
  const { t } = useTranslation();

  const { data: userList, mutateAsync: searchUser } =
    api.user.searchUserByName.useMutation();
  const { mutateAsync: updatePermission } =
    api.page.setPermissionPage.useMutation({
      onError: (err) =>
        handleUnauthorize(
          getTRPCErrorFromUnknown(err).code,
          () => void router.push("/")
        ),
    });

  const handleSearchUser = debounce(async (value: string) => {
    await searchUser({
      query: value,
      permissionList: pageData?.permissionId || [],
    });
  });

  const handleAddUser = async (userId: string) => {
    if (pageData) {
      try {
        await updatePermission({ pageId: pageData.id, userIds: userId });
        onClose();
        toast.success(t("addSuccess"));
      } catch (error) {
        toast.error(getTRPCErrorFromUnknown(error).message);
      }
    }
  };

  return (
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
  );
};

export default AddPermissionTab;
