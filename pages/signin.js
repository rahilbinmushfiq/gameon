import nookies from "nookies";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { getAuth } from "firebase-admin/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { auth, db } from "../config/firebase";
import { adminApp } from "../config/firebaseAdmin";
import { useAuth } from "../contexts/auth";
import { useLoading } from "../contexts/loading";
import Verification from "../components/signIn/verification";
import EmailAndPasswordSignIn from "../components/signIn/emailAndPasswordSignIn";
import Register from "../components/signIn/register";
import GoogleSignIn from "../components/signIn/googleSignIn";
import createErrorMessage from "../utils/createErrorMessage";
import { HiMail } from "react-icons/hi";

export default function SignIn({ users }) {
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [isUserNew, setIsUserNew] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const emailRef = useRef("");
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

            setIsPageLoading(true);
            try {
              await signOut(auth);
            } catch (error) {
              toast.error(createErrorMessage(error));
            }
            setIsPageLoading(false);

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
    <main className="sm:min-h-[66.66vh] sm:grid sm:grid-cols-5">
      <Head>
        <title>{`${(email && users.every((user) => user.email !== email)) ? "Register" : "Sign in"} | Game On`}</title>
      </Head>
      <section className="hidden p-10 bg-signin sm:flex sm:flex-col sm:gap-y-3 sm:justify-center sm:col-span-2">
        <p className="relative text-[#cfcfcf]"><span className="absolute -top-14 -left-4 text-9xl text-[#dd7878]">"</span>Joining a gaming community is like finding a second family, one that shares your passion for gaming.</p>
        <h2 className="font-semibold text-2xl text-right text-[#f1f1f1]">- Game On</h2>
      </section>
      <section className="px-6 pt-6 pb-14 space-y-20 sm:px-10 sm:col-span-3 sm:flex sm:flex-col sm:justify-between">
        <div className="space-y-8">
          {isUserNew && (!email || (email && users.some((user) => user.email === email))) && (
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Registration Complete!</h2>
              <p>You have successfully created your account. Now, you can sign in to your new account using the credentials you provided.</p>
            </div>
          )}
          {!email ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1>Sign in</h1>
                <p>Provide your email address to continue.</p>
              </div>
              <div className="space-y-8">
                <div className="relative">
                  <input
                    className="typing-input pl-12 peer"
                    ref={emailRef}
                    type="text"
                    placeholder="Enter your email"
                    onKeyUp={(event) => event.key === "Enter" && emailValidation()}
                    autoFocus
                  />
                  <HiMail
                    className="typing-input--icon"
                    size={48}
                    onClick={() => emailRef.current.focus()}
                  />
                </div>
                <button
                  className="secondary-btn w-full h-12 hover:bg-[#ffffff]"
                  type="button"
                  onClick={() => emailValidation()}
                >
                  <p>Next</p>
                  <IoChevronForward size={13} color="#1f1f1f" />
                </button>
              </div>
            </div>
          ) : (
            users.every((user) => user.email !== email) ? (
              <Register
                email={email}
                setEmail={setEmail}
              />
            ) : (
              isProviderOnlyGoogle() ? (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">
                      Can't Sign in with Password
                    </h2>
                    <p>The email address you provided was used to sign in with Google provider last time. In case you provided the wrong email address, you can go back and provide the correct one, otherwise, sign in with Google.</p>
                  </div>
                  <button
                    className="secondary-btn w-full h-12 hover:bg-[#ffffff]"
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
                  setIsUserLoaded={setIsUserLoaded}
                />
              )
            )
          )}
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-7 items-center">
            <hr className="col-span-3 border-[#6f6f6f]" />
            <p className="col-span-1 text-base text-center text-[#6f6f6f]">
              or
            </p>
            <hr className="col-span-3 border-[#6f6f6f]" />
          </div>
          <GoogleSignIn
            users={users}
            setIsUserLoaded={setIsUserLoaded}
          />
        </div>
      </section>
    </main>
  );
  if (user && !user.emailVerified) return (
    <main className="sm:min-h-[60vh] sm:grid sm:grid-cols-5">
      <Head>
        <title>Verfiy Email | Game On</title>
      </Head>
      <section className="hidden p-10 bg-signin sm:flex sm:flex-col sm:gap-y-3 sm:justify-center sm:col-span-2">
        <p className="relative text-[#cfcfcf]"><span className="absolute -top-14 -left-4 text-9xl text-[#dd7878]">"</span>Joining a gaming community is like finding a second family, one that shares your passion for gaming.</p>
        <h2 className="font-semibold text-2xl text-right text-[#f1f1f1]">- Game On</h2>
      </section>
      <section className="px-6 pt-6 pb-14 space-y-10 sm:px-10 sm:col-span-3">
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
        };
      }
    }

    const usersSnapshot = await getDocs(collection(db, "users"));

    const users = usersSnapshot.docs.map((doc) => {
      return { ...doc.data() }
    });

    return {
      props: {
        users
      }
    }
  } catch (error) {
    console.log(error);

    return {
      redirect: {
        destination: "/home",
        permanent: false
      }
    };
  }
}
