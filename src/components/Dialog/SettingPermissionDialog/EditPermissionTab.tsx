import { CircularProgress, Stack } from "@mui/material";
import type { Page, User } from "@prisma/client";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { api } from "~/utils/api";
import { handleUnauthorize } from "~/utils/constant";
import PermissionUserItem from "./PermissionUserItem";
import { useEffect } from "react";

interface IProps {
  pageData?: Page | null;
  onClose: () => void;
}

const EditPermissionTab = (props: IProps) => {
  const { pageData, onClose } = props;
  const router = useRouter();
  const { t } = useTranslation();

  const { mutateAsync: removePermission } =
    api.page.removePermissionUser.useMutation({
      onError: (err) =>
        handleUnauthorize(
          getTRPCErrorFromUnknown(err).code,
          () => void router.push("/")
        ),
    });

  const {
    data: userList,
    refetch,
    isLoading,
  } = api.page.getListPermissionUserById.useQuery(
    { id: pageData?.id || "0" },
    {
      onError: (err) =>
        handleUnauthorize(
          getTRPCErrorFromUnknown(err).code,
          () => void router.push("/")
        ),
    }
  );

  const handleAddUser = async (userId: string) => {
    if (pageData) {
      try {
        await removePermission({ pageId: pageData.id, userId: userId });
        onClose();
        toast.success(t("removeSuccess"));
      } catch (error) {
        toast.error(getTRPCErrorFromUnknown(error).message);
      }
    }
  };

  useEffect(() => {
    void refetch();
  }, [pageData?.id, refetch]);

  return (
    <Stack direction="column">
      <Stack direction="row" alignItems="center" mb={1}></Stack>
      <SimpleBar style={{ maxHeight: "240px" }}>
        <Stack direction="column" gap={1.5}>
          {isLoading && (
            <Stack
              width="100%"
              justifyContent="center"
              minHeight="150px"
              alignItems="center"
            >
              <CircularProgress
                size="24px"
                sx={{ color: (theme) => theme.palette.text.primary }}
              />
            </Stack>
          )}

          {userList?.map((user) => (
            <PermissionUserItem
              key={user.id}
              handleAddUser={handleAddUser}
              data={user as User}
              hidden={false}
              isEdit={true}
            />
          ))}
        </Stack>
      </SimpleBar>
    </Stack>
  );
};

export default EditPermissionTab;
