import Head from "next/head";
import nookies from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAuth } from "firebase-admin/auth";
import { toast } from "react-toastify";
import { MdLogout } from "react-icons/md";
import { auth } from "../config/firebase";
import { adminApp } from "../config/firebaseAdmin";
import { useAuth } from "../contexts/auth";
import { useLoading } from "../contexts/loading";
import UserProfile from "../components/account/userProfile";
import UpdatePassword from "../components/account/updatePassword";
import DeleteAccount from "../components/account/deleteAccount";

/*
 * The Account component is a page where users can view and manage their account information, such as their user profile, password, and account deletion. Users must be signed in to access this page. The component also includes a sign-out button for smaller screens if the user is signed in.
 *
 * @param {string} signInProvider - The sign-in provider used by the user to sign in.
 * @returns {JSX.Element} A React JSX element that displays the account page.
 */
export default function Account({ signInProvider }) {
  const { user } = useAuth(); // Retrieve current user from Auth context
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If the user is not signed in, redirect to the sign in page
      if (!user) {
        router.push("/signin");
      }
    });

    unsubscribe(); // Unsubscribe from onAuthStateChanged listener
  }, [user, router]);

  // Function to sign user out
  const userSignOut = async () => {
    setIsPageLoading(true);

    try {
      await signOut(auth);
      toast.success("Successfully signed out.");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }

    setIsPageLoading(false);
  };

  return (
    /* Main container with a dynamic height based on screen size */
    <main className="flex flex-col min-h-[calc(100vh_-_54px)] divide-y-2 divide-[#2f2f2f] sm:min-h-[calc(100vh_-_76px)] md:min-h-[calc(100vh_-_6.5rem)]">
      <Head>
        <title>{user ? `${user.displayName} | Game On` : "Game On"}</title>
      </Head>
      <UserProfile user={user} />
      <UpdatePassword user={user} signInProvider={signInProvider} />
      <DeleteAccount user={user} signInProvider={signInProvider} />
      {user && (
        /* If the user is signed in, render the sign out button */
        <div className="flex items-center px-6 py-4 sm:px-10 sm:py-6 md:p-3">
          <button
            className="primary-btn primary-btn--hover w-full h-12 md:hidden"
            onClick={userSignOut}
          >
            <p>Sign Out</p>
            <MdLogout size={16} color="#f1f1f1" />
          </button>
        </div>
      )}
    </main>
  );
}

/* Verifies user authentication token from cookies to check if user is authenticated and authorized. If user is authenticated and authorized, it retrieves user's sign-in provider for the page.
 * 
 * @param {Object} context - The context object containing information about the incoming HTTP request.
 * @returns {Object} The server-side props containing the user's sign-in provider.
 * @returns {Object} The server-side redirect in case of missing token or unverified user email.
 * @throws {Object} The server-side redirect containing the redirection destination in case of an error.
 */
export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context); // Retrieve cookies from the incoming request

    // Redirect to sign-in page if token cookie is missing
    if (!cookies.token) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false
        }
      };
    }

    // Verify user's token with Firebase Admin SDK
    const adminAuth = getAuth(adminApp);
    const token = await adminAuth.verifyIdToken(cookies.token);

    // Redirect to sign-in page if user's email is not verified
    if (!token.email_verified) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false
        }
      };
    }

    // Return sign-in provider as prop for the page
    return {
      props: {
        signInProvider: token.firebase.sign_in_provider
      }
    };
  } catch (error) {
    console.log(error);

    // Redirect to sign-in page if an error occurs
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };
  }
}
