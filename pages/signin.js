import nookies from "nookies";
import { collection, getDocs } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../config/firebase";
import Register from "../components/signIn/register";
import Verification from "../components/signIn/verification";
import EmailAndPasswordSignIn from "../components/signIn/emailAndPasswordSignIn";
import GoogleSignIn from "../components/signIn/googleSignIn";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "../config/firebaseAdmin";
import { useAuth } from "../config/auth";
import { onAuthStateChanged } from "firebase/auth";
import { IoChevronForward } from "react-icons/io5";

export default function SignIn({ users }) {
  const { user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isUserNew, setIsUserNew] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified && isUserLoaded) {
        router.push("/account");
      } else if (user && !user.emailVerified) {
        let interval = setInterval(async () => {
          if (user.emailVerified) {
            clearInterval(interval);
            auth.signOut();
            setIsUserNew(true);
            setEmail("");
            router.push("/signin");
          }
          await user.reload();
        }, 2000);
      }
    });

    unsubscribe();
  }, [user, isUserLoaded]);

  if (isLoading) return <h1>Loading...</h1>;

  const isProviderOnlyGoogle = () => {
    const [user] = users.filter((user) => user.email === email);

    if (user.registrationMethod === "google.com" && !user.linked) {
      return true;
    } else {
      return false;
    }
  }

  if (!user) return (
    <main>
      <section className="px-6 py-8 max-w-full">
        {isUserNew && <p className="text-[#a9a9a9]">Your account creation is complete! Now, you can sign in to your new account.</p>}
        {/* <h1 className="text-3xl underline mb-3">Sign In</h1> */}
        {!email ? (
          <div className="space-y-8 py-12">
            <input
              className="sign-in--input"
              ref={emailRef}
              type="text"
              placeholder="Enter your email"
              onKeyUp={(event) => event.key === "Enter" && setEmail(emailRef?.current?.value)}
              autoFocus
            />
            <button
              className="flex gap-2 justify-center items-center w-full h-12 rounded-sm text-[#1f1f1f] bg-[#f1f1f1]"
              type="button"
              onClick={() => setEmail(emailRef?.current?.value)}
            >
              <p className="font-semibold">Next</p>
              <IoChevronForward size={13} color="#1f1f1f" />
            </button>
          </div>
        ) : (
          users.every((user) => user.email !== email) ? (
            <Register
              fullNameRef={fullNameRef}
              passwordRef={passwordRef}
              confirmPasswordRef={confirmPasswordRef}
              email={email}
              setEmail={setEmail}
            />
          ) : (
            isProviderOnlyGoogle() ? (
              <p className="text-[#a9a9a9] py-4">
                The last time you signed up for our website, you used Google sign in provider. If you want to avail password sign in system for your account, first you must login via the Google sign in provider below and then add a password for your account.
              </p>
            ) : (
              <EmailAndPasswordSignIn
                email={email}
                setEmail={setEmail}
                passwordRef={passwordRef}
                isUserNew={isUserNew}
                setIsUserNew={setIsUserNew}
                setIsUserLoaded={setIsUserLoaded}
              />
            )
          )
        )}
        <div className="grid grid-cols-7 items-center pb-6">
          <hr className="col-span-3 border-[#a9a9a9]" />
          <p className="col-span-1 text-base text-center text-[#a9a9a9]">
            or
          </p>
          <hr className="col-span-3 border-[#a9a9a9]" />
        </div>
        <GoogleSignIn
          users={users}
          setIsUserLoaded={setIsUserLoaded}
        />
      </section>
    </main>
  );
  if (user && !user.emailVerified) return (
    <main>
      <section className="px-6 py-8 space-y-8 max-w-full">
        <Verification user={user} />
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);

    if (cookies.token) {
      const adminAuth = getAuth(adminApp);
      const token = await adminAuth.verifyIdToken(cookies.token);

      const { email_verified } = token;

      if (email_verified) {
        return {
          redirect: {
            destination: "/account",
            permanent: false
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  const querySnapshot = await getDocs(collection(db, "users"));

  const users = querySnapshot.docs.map((doc) => {
    return { ...doc.data() }
  });

  return {
    props: {
      users
    }
  }
}
