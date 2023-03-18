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
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";

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
        toast.success("Sign in successful.");
        router.push("/account");
      } else if (user && !user.emailVerified) {
        let interval = setInterval(async () => {
          if (user.emailVerified) {
            clearInterval(interval);
            auth.signOut();
            setIsUserNew(true);
            setEmail("");
            toast.success("Email verification successful.", {
              autoClose: 4000
            });
            router.push("/signin");
          }
          await user.reload();
        }, 2000);
      }
    });

    unsubscribe();
  }, [user, isUserLoaded]);

  if (isLoading) return <h1>Loading...</h1>;

  const emailValidation = () => {
    if (!emailRef?.current?.value) {
      toast.error("Email field cannot be empty.");
      return;
    } else if (!(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(emailRef?.current?.value))) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setEmail(emailRef?.current?.value);
  }

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
        {isUserNew && (
          <div className="space-y-1 pb-12">
            <h2 className="text-lg font-semibold text-[#f1f1f1]">Account Successfully Created!</h2>
            <p className="text-[#a9a9a9] leading-6">
              Your account creation is complete! Now, you can sign in to your new account.
            </p>
          </div>
        )}
        {!email ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#f1f1f1]">Sign in</h2>
              <p className="text-[#a9a9a9]">
                Provide your email address to continue.
              </p>
            </div>
            <div className="space-y-8 pb-12">
              <input
                className="sign-in--input"
                ref={emailRef}
                type="text"
                placeholder="Enter your email"
                onKeyUp={(event) => event.key === "Enter" && emailValidation()}
                autoFocus
              />
              <button
                className="flex gap-2 justify-center items-center w-full h-12 rounded-sm text-[#1f1f1f] bg-[#f1f1f1]"
                type="button"
                onClick={() => emailValidation()}
              >
                <p className="font-semibold">Next</p>
                <IoChevronForward size={13} color="#1f1f1f" />
              </button>
            </div>
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
              <div className="space-y-6 pb-12">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-[#f1f1f1]">Can't Sign in with Password</h2>
                  <p className="text-[#a9a9a9] leading-6">
                    The email address you provided was used to sign in with Google provider last time. In case you provided the wrong email address, you can go back and provide the correct one, otherwise, sign in with Google below.
                  </p>
                </div>
                <button
                  className="flex gap-2 justify-center items-center w-full h-12 rounded-sm text-[#1f1f1f] bg-[#f1f1f1]"
                  type="button"
                  onClick={() => setEmail("")}
                >
                  <IoChevronBack size={13} color="#1f1f1f" />
                  <p className="font-semibold">Back</p>
                </button>
              </div>
            ) : (
              <EmailAndPasswordSignIn
                email={email}
                setEmail={setEmail}
                passwordRef={passwordRef}
                isUserNew={isUserNew}
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
