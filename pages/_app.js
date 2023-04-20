import { AuthProvider } from "../contexts/auth";
import { LoadingProvider } from "../contexts/loading";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoadingProvider>
    </AuthProvider>
  );
}
