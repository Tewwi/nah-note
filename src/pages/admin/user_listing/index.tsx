import { Container, Stack, Typography } from "@mui/material";
import { getCookie } from "cookies-next";
import { debounce } from "lodash";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ListingHeader from "~/components/ListingScreen/ListingHeader";
import UserTable from "~/components/Table/UserTable";
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

const UserListing = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { page, orderBy, orderType, query } = router.query;
  const [cursor, setCursor] = useState<string | null | undefined>();

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

  return (
    <>
      <Head>
        <title>Nah | Page Detail</title>
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
              console.log("hehe");
            }}
            defaultValue={query?.toString() || ""}
          />
          <UserTable
            data={data?.data}
            totalPage={data?.total || 1}
            onOrderChange={handleSort}
            onPageChange={handleChangePage}
            isLoading={isLoading && !data}
            refetchData={() => {
              void refetch();
            }}
          />
        </Stack>
      </Container>
    </>
  );
};

export default UserListing;
