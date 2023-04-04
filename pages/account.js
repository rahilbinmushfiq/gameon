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

export default function Account({ signInProvider }) {
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
      }
    });

    unsubscribe();
  }, [user]);

  const userSignOut = async () => {
    setIsPageLoading(true);

    try {
      await signOut(auth);
      toast.success("Successfully signed out.");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }

    setIsPageLoading(false);
  }

  return (
    <main className="flex flex-col max-w-full min-h-[calc(100vh_-_3.5rem)] divide-y-2 divide-[#2f2f2f]">
      <Head>
        <title>{user && `${user.displayName} | `}Game On</title>
      </Head>
      <UserProfile user={user} />
      <UpdatePassword user={user} signInProvider={signInProvider} />
      <DeleteAccount user={user} signInProvider={signInProvider} />
      {user && (
        <div className="p-6 flex items-center">
          <button
            className="primary-btn primary-btn--hover w-full h-12"
            onClick={userSignOut}
          >
            <p>Sign Out</p>
            <MdLogout size={16} color="#f1f1f1" />
          </button>
        </div>
      )}
    </main>
  )
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);

    if (!cookies.token) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }

    const adminAuth = getAuth(adminApp);
    const token = await adminAuth.verifyIdToken(cookies.token);

    const { email_verified, firebase: { sign_in_provider } } = token;

    if (!email_verified) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }

    return {
      props: {
        signInProvider: sign_in_provider
      }
    };
  } catch (error) {
    console.log(error);

    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}