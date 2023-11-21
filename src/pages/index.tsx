import { useRouter } from "next/router";
import { useEffect } from "react";
import PageLoading from "~/components/PageComponent/PageLoading";
import { api } from "~/utils/api";

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const token = getCookie("token", { req, res });
//   if (token) {
//     const ssg = generateSSGHelper(token?.toString());
//     await ssg.user.getCurrUserDetail.prefetch();

//     return {
//       props: {
//         trpcState: ssg.dehydrate(),
//       },
//     };
//   }

//   return {
//     redirect: {
//       destination: "dashboard",
//       permanent: false,
//     },
//   };
// };

export default function Home() {
  const { data: userPages } = api.page.getPageByCurrUser.useQuery({ page: 1 });
  const router = useRouter();

  useEffect(() => {
    if (userPages?.resp) {
      void router.replace(`page/${userPages?.resp[0]?.id}`);
    }
  }, [router, userPages?.resp]);

  return <PageLoading />;
}
