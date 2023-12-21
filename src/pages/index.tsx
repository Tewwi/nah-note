/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageLoading from "~/components/PageComponent/PageLoading";
import { generateSSGHelper } from "~/server/utils";
import { api } from "~/utils/api";
import { Role } from "~/utils/constant";

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
      destination: "/dashboard",
      permanent: false,
    },
  };
};

export default function Home() {
  const { data: userPages } = api.page.getPageByCurrUser.useQuery({ page: 1 });
  const { data: userInfo } = api.user.getCurrUserDetail.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (userPages && userPages?.resp) {
      if (userInfo?.role === Role.USER.value) {
        void router.push(`/page/${userPages?.resp[0]?.id}`);
      } else {
        void router.push(`/admin/user_listing`);
      }
    }
  }, [router, userInfo, userPages]);

  return <PageLoading />;
}
