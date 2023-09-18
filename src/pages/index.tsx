import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { generateSSGHelper } from "~/server/utils";
import styles from "./index.module.css";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";

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
      destination: "auth/login",
      permanent: false,
    },
  };
};

export default function Home() {
  const { data: userPages } = api.page.getPageByCurrUser.useQuery({ page: 1 });
  const router = useRouter(); 

  useEffect(() => {
    if (userPages?.resp) {
      void router.replace(`page/${userPages?.resp[0]?.id}`)
    }
  }, [router, userPages?.resp]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>
            Create <span className={styles.pinkSpan}>T3</span> App
          </h1>
          <div className={styles.cardRow}>
            <Link
              className={styles.card}
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className={styles.cardTitle}>First Steps →</h3>
              <div className={styles.cardText}>
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className={styles.card}
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className={styles.cardTitle}>Documentation →</h3>
              <div className={styles.cardText}>
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
