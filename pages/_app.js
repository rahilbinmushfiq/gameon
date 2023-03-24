import Layout from '../components/layout/layout'
import { AuthProvider } from '../contexts/auth'
import '../styles/globals.css'
import { LoadingProvider } from '../contexts/loading';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoadingProvider>
    </AuthProvider>
  )
}

export default MyApp
