import { Container, Stack, Typography } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { getCookie } from "cookies-next";
import { debounce } from "lodash";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ConfirmDeleteDialog from "~/components/Dialog/ConfirmDialog/ConfirmDeleteDialog";
import CreateOrUpdateDialog from "~/components/Dialog/UserListingDialog/CreateOrUpdateDialog";
import ListingHeader from "~/components/ListingScreen/ListingHeader";
import type { ISort } from "~/interface/common";
import { generateSSGHelper } from "~/server/utils";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";

const UserTable = dynamic(() =>
  import("~/components/Table/UserTable").then((module) => module.default)
);

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getCookie("token", { req, res });
  if (token) {
    const ssg = generateSSGHelper(token?.toString());
    await ssg.user.getCurrUserDetail.prefetch();

    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  }

  return {
    redirect: {
      destination: "dashboard",
      permanent: false,
    },
  };
};

const UserListing = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { page, orderBy, orderType, query } = router.query;

  const [cursor, setCursor] = useState<string | null | undefined>();
  const [editId, setEditId] = useState<string>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>();
  const [blockUserInfo, setBlockUserInfo] = useState<{
    id: string | undefined;
    status: boolean;
  }>({ status: false, id: undefined });

  const {
    mutateAsync: getUserDetail,
    data: userDetail,
    reset: resetDataUser,
  } = api.user.getUserDetailById.useMutation();
  const { mutateAsync: deleteUser } = api.user.deleteUser.useMutation();
  const { mutateAsync: toggleBlockUser } =
    api.user.toggleBlockUser.useMutation();
  const { data, refetch, isLoading } = api.user.getAllUser.useQuery({
    page: Number(page) || 1,
    cursor: cursor,
    orderBy: orderBy?.toString(),
    orderType: orderType?.toString(),
    query: query?.toString() || "",
  });

  const handleChangePage = (page: number) => {
    router.query.page = page.toString();
    setCursor(data?.nextCursor);
    void router.replace(router);
    void refetch();
  };

  const handleSort = (params: ISort) => {
    router.query.orderBy = params.orderBy;
    router.query.orderType = params.orderType;
    router.query.page = "1";
    void router.replace(router);
    void refetch();
  };

  const onChangeQuery = debounce(async (value: string) => {
    router.query.query = value;
    void router.replace(router);
    await refetch();
  }, 200);

  const handleClose = () => {
    setOpenDialog(false);
    setEditId(undefined);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      await getUserDetail(id);
      setEditId(id);
      setOpenDialog(true);
    } catch (error) {
      toast.error(getTRPCErrorFromUnknown(error).message);
    }
  };

  const handleOpenAdd = () => {
    setEditId(undefined);
    resetDataUser();
    setOpenDialog(true);
  };

  const handleToggleBlock = async () => {
    if (blockUserInfo.id) {
      try {
        await toggleBlockUser({
          ...blockUserInfo,
          id: blockUserInfo.id,
        });
        void refetch();
        setBlockUserInfo({ ...blockUserInfo, id: undefined });
        toast.success(t("success"));
      } catch (error) {
        toast.error(getTRPCErrorFromUnknown(error).message);
      }
    }
  };

  const handleOpenBlockUserDialog = (id: string, status: boolean) => {
    setBlockUserInfo({ id: id, status: status });
  };

  const handleDeleteUser = async () => {
    if (deleteId) {
      try {
        await deleteUser(deleteId);
        void refetch();
        setDeleteId(undefined);
        toast.success(t("success"));
      } catch (error) {
        toast.error(getTRPCErrorFromUnknown(error).message);
      }
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setDeleteId(id);
  };

  return (
    <>
      <Head>
        <title>Nah | User Listing</title>
      </Head>
      <Container maxWidth="md">
        <Typography variant="h3" my={2}>
          {t("userListing")}
        </Typography>
        <Stack gap={1}>
          <ListingHeader
            handleSearch={onChangeQuery}
            placeHolder={t("searchUser")}
            onClickBtn={() => {
              handleOpenAdd();
            }}
            defaultValue={query?.toString() || ""}
            btnText={t("addUser")}
          />
          <UserTable
            data={data?.data}
            totalPage={data?.total || 1}
            onOrderChange={handleSort}
            onPageChange={handleChangePage}
            isLoading={isLoading && !data}
            handleOpenEdit={(id: string) => {
              void handleOpenEdit(id);
            }}
            handleOpenDelete={handleOpenDeleteDialog}
            handleOpenBlockUserDialog={handleOpenBlockUserDialog}
          />
        </Stack>

        <CreateOrUpdateDialog
          open={openDialog}
          id={editId}
          onClose={handleClose}
          type={editId ? "edit" : "add"}
          data={userDetail || undefined}
          refetchData={() => {
            void refetch();
          }}
        />

        <ConfirmDeleteDialog
          open={Boolean(deleteId)}
          onClose={() => setDeleteId(undefined)}
          title={t("deleteUser")}
          decs={t("deleteUserDecs")}
          handleSubmit={handleDeleteUser}
        />

        <ConfirmDeleteDialog
          open={Boolean(blockUserInfo.id)}
          onClose={() => setBlockUserInfo({ ...blockUserInfo, id: undefined })}
          title={blockUserInfo.status ? t("blockUser") : t("unblockUser")}
          decs={
            blockUserInfo.status ? t("blockUserDesc") : t("unblockUserDesc")
          }
          handleSubmit={handleToggleBlock}
        />
      </Container>
    </>
  );
};

export default UserListing;
