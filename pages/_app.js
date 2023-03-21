import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import Layout from '../components/layout'
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
