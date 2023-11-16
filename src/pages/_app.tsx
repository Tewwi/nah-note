import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ThemeConfig } from "~/theme/ThemeConfig";
import Layout from "~/components/Layout/Layout";
import { Toaster } from "react-hot-toast";
import "../i18/config";
import { AppProvider } from "~/context/GlobalContext";
import style from "./index.module.css";
import { useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    document.querySelector("body")?.classList.add(`${style.app}`);
  }, []);

  return (
    <AppProvider>
      <ThemeConfig>
        <Layout {...pageProps}>
          <Toaster position="top-center" />
          <Component {...pageProps} />
        </Layout>
      </ThemeConfig>
    </AppProvider>
  );
};

export default api.withTRPC(MyApp);
