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

export default function SignIn({ users }) {
  const { user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isUserNew, setIsUserNew] = useState(false);
  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
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
  }, [user]);

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
      <section>
        {isUserNew && <p>Your account creation is complete! Now, you can sign in to your new account.</p>}
        <h1 className="text-3xl underline mb-3">Sign In</h1>
        {!email ? (
          <div className="flex flex-col w-fit gap-4">
            <input
              className="border border-neutral-900 w-[15rem] h-8"
              ref={emailRef}
              type="text"
              placeholder="Enter your email"
              onKeyUp={(event) => event.key === "Enter" && setEmail(emailRef?.current?.value)}
              autoFocus
            />
            <button
              className="text-white bg-neutral-900 w-[5rem] h-8"
              type="button"
              onClick={() => setEmail(emailRef?.current?.value)}
            >
              Next
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
              <h2 className="w-[20rem]">
                The last time you signed up for our website, you used Google sign in provider. If you want to avail password sign in system for your account, first you must login via the Google sign in provider below and then add a password for your account.
              </h2>
            ) : (
              <EmailAndPasswordSignIn
                email={email}
                setEmail={setEmail}
                passwordRef={passwordRef}
                isUserNew={isUserNew}
                setIsUserNew={setIsUserNew}
              />
            )
          )
        )}
        <GoogleSignIn users={users} />
      </section>
    </main>
  );
  if (user && !user.emailVerified) return (
    <main>
      <section className="flex flex-col gap-2">
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
