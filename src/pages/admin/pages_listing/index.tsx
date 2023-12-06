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
import CreatePageDialog from "~/components/Dialog/CreatePageDialog/CreatePageDialog";
import ListingHeader from "~/components/ListingScreen/ListingHeader";
import PageTable from "~/components/Table/PageTable";
import type { ISort } from "~/interface/common";
import { generateSSGHelper } from "~/server/utils";
import { api } from "~/utils/api";

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

const PageListing = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { page, orderBy, orderType, query } = router.query;
  const [cursor, setCursor] = useState<string | null | undefined>();
  const { mutateAsync: deleteUser } = api.page.deletePageById.useMutation();
  const { data, refetch, isLoading } = api.page.getAllPages.useQuery({
    page: Number(page) || 1,
    cursor: cursor,
    orderBy: orderBy?.toString(),
    orderType: orderType?.toString(),
    query: query?.toString() || "",
  });

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>();

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

  const handleOpenAdd = () => {
    setOpenDialog(true);
  };

  const handleDeleteUser = async () => {
    if (deleteId) {
      try {
        await deleteUser({ id: deleteId });
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
        <title>Nah | Page Listing</title>
      </Head>
      <Container maxWidth="md">
        <Typography variant="h3" my={2}>
          {t("pageListing")}
        </Typography>
        <Stack gap={1}>
          <ListingHeader
            handleSearch={onChangeQuery}
            placeHolder={t("searchPage")}
            onClickBtn={() => {
              handleOpenAdd();
            }}
            defaultValue={query?.toString() || ""}
            btnText={t("addPage")}
          />
          <PageTable
            data={data?.data}
            totalPage={data?.total || 1}
            onOrderChange={handleSort}
            onPageChange={handleChangePage}
            isLoading={isLoading && !data}
            handleOpenDelete={handleOpenDeleteDialog}
          />
        </Stack>

        <CreatePageDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          refetchData={async () => {
            await refetch();
          }}
        />

        <ConfirmDeleteDialog
          open={Boolean(deleteId)}
          onClose={() => setDeleteId(undefined)}
          title={t("deletePage")}
          decs={t("deletePageDecs")}
          handleSubmit={handleDeleteUser}
        />
      </Container>
    </>
  );
};

export default PageListing;
