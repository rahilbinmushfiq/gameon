import nookies from "nookies";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase-admin/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/firebase";
import { adminApp } from "../config/firebaseAdmin";
import { useAuth } from "../config/auth";
import UserProfile from "../components/account/userProfile";
import UpdatePassword from "../components/account/updatePassword";
import DeleteAccount from "../components/account/deleteAccount";

export default function Account({ signInProvider }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
      }
    });

    unsubscribe();
  }, [user]);

  return (
    <main className="max-w-full px-6 py-12">
      <UserProfile user={user} />
      <UpdatePassword user={user} signInProvider={signInProvider} />
      <DeleteAccount user={user} signInProvider={signInProvider} />
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