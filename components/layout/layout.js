import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/auth";
import { useLoading } from "../../contexts/loading";
import Navbar from "./navbar";
import Footer from "./footer";
import Loader from "../loader";

/*
 * The Layout component renders the common layout structure of the application, such as the Navbar and Footer components, and sets the document title and meta tags for the page. It also handles page loading and user loading states, and renders the Loader component and ToastContainer to display loading spinners and toast messages respectively.
 * 
 * @param {React.ReactNode} children - The child components to render within the Layout component.
 * @returns {JSX.Element} A wrapper element that provides a common layout to its children.
 */
export default function Layout({ children }) {
  const { isUserLoading } = useAuth(); // Retrieve user loading state from Auth context
  const { isPageLoading } = useLoading(); // Retrieve page loading state from Loading context

  return (
    <>
      <Head>
        {// Set the title only when the user or the page is loading
          (isUserLoading || isPageLoading) && <title>Game On</title>
        }
        <meta name="description" content="Game On is a free platform where users can review and search games." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="game, review, rating, comment, search, filter, overview, critic reviews, user reviews, system requirements" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {// Check if the user is loading
        isUserLoading ? (
          // If the user is loading, render the Loader component to show loading spinner
          <Loader isLoading={isUserLoading} />
        ) : (
          // If the user has finished loading, render the page content along with Navbar and Footer components
          <div>
            {// If the page is loading, render the Loader component to show loading spinner
              isPageLoading && (
                <Loader isLoading={isPageLoading} />
              )
            }
            <Navbar />
            {children}
            <Footer />
          </div>
        )
      }
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
  );
}
