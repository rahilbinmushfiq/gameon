import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";
import { useAuth } from "../contexts/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./loader";
import { useLoading } from "../contexts/loading";

export default function Layout({ children }) {
  const { isUserLoading } = useAuth();
  const { isPageLoading } = useLoading();

  return (
    <>
      <Head>
        {(isUserLoading || isPageLoading) && <title>Game On</title>}
        <meta name="description" content="Game On is a free platform where users can review and search games." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="game, review, rating, comment, search, filter, overview, critic reviews, user reviews, system requirements" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isUserLoading ? (
        <Loader isLoading={isUserLoading} />
      ) : (
        <div className="max-w-screen">
          {isPageLoading && (
            <Loader isLoading={isPageLoading} />
          )}
          <Navbar />
          {children}
          <Footer />
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}
