import nookies from "nookies";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAuth } from "firebase-admin/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/firebase";
import { adminApp } from "../config/firebaseAdmin";
import { useAuth } from "../contexts/auth";
import { useLoading } from "../contexts/loading";
import { toast } from "react-toastify";
import { FaSignOutAlt } from "react-icons/fa";
import UserProfile from "../components/account/userProfile";
import UpdatePassword from "../components/account/updatePassword";
import DeleteAccount from "../components/account/deleteAccount";
import Head from "next/head";

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
    <main className="max-w-full min-h-[calc(100vh_-_3.5rem)] flex flex-col divide-y-2 divide-[#2f2f2f]">
      <Head>
        <title>{`${user && `${user.displayName} |`} Game On`}</title>
      </Head>
      <UserProfile user={user} />
      <UpdatePassword user={user} signInProvider={signInProvider} />
      <DeleteAccount user={user} signInProvider={signInProvider} />
      {user && (
        <div className="flex-grow p-6 bg-[#2a2a2a] flex items-center">
          <button
            className="flex justify-center items-center gap-2 w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30] hover:text-[#e30e30] hover:bg-[#f1f1f1] [&>*]:hover:fill-[#e30e30]"
            onClick={userSignOut}
          >
            <p>Sign Out</p>
            <FaSignOutAlt size={15} color="#f1f1f1" />
          </button>
        </div>
      )}
    </main>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  if (!cookies.token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  try {
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
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}