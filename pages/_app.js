import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import Layout from '../components/layout'
import { AuthProvider } from '../config/auth'
import '../styles/globals.css'
import { HashLoader } from "react-spinners";

function MyApp({ Component, pageProps }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => setIsPageLoading(true));
    router.events.on("routeChangeComplete", () => setIsPageLoading(false));

    return () => {
      router.events.off("routeChangeStart", () => setIsPageLoading(true));
      router.events.off("routeChangeComplete", () => setIsPageLoading(false));
    }
  }, []);

  return (
    <AuthProvider>
      <Layout>
        {isPageLoading ? (
          <div className="min-h-screen max-w-screen flex justify-center items-center">
            <HashLoader
              color="rgb(225 29 72)"
              loading={isPageLoading}
              size={50}
              speedMultiplier={2}
            />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
