import "../app/globals.css";
import Layout from "components/Layout";
import { Providers } from "@/components/providers";

function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  );
}
export default MyApp;
