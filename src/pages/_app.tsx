import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeConfig } from "~/theme/ThemeConfig";
import Layout from "~/components/Common/Layout";
import { Toaster } from "react-hot-toast";
import '../i18/config';

const MyApp: AppType = ({ Component, pageProps }) => {
  
  return (
    <ThemeConfig>
      <Layout {...pageProps}>
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </Layout>
    </ThemeConfig>
  );
};

export default api.withTRPC(MyApp);
