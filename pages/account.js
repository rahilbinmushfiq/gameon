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

export default function Account({ userData }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
      }
    })
  }, [user]);

  return (
    <main>
      <UserProfile userData={userData} />
      <UpdatePassword user={user} />
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

    const { name, picture, email, email_verified, uid } = token;

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
        userData: {
          name, picture, email
        }
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}