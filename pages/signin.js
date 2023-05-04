import Head from "next/head";
import nookies from "nookies";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase-admin/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { HiMail } from "react-icons/hi";
import { auth, db } from "../config/firebase";
import { adminApp } from "../config/firebaseAdmin";
import { useAuth } from "../contexts/auth";
import { useLoading } from "../contexts/loading";
import Verification from "../components/signIn/verification";
import EmailAndPasswordSignIn from "../components/signIn/emailAndPasswordSignIn";
import Register from "../components/signIn/register";
import GoogleSignIn from "../components/signIn/googleSignIn";
import createErrorMessage from "../utils/createErrorMessage";

/*
 * The Sign in component displays the sign-in page that dynamically renders the section element and page title based on the user's sign-in progress.
 * Users can sign in with Google, or manually enter their email to sign in or register.
 * If a match is found for the user email in database, the component renders the sign-in section.
 * If no match is found, the component renders the register section.
 * If the user registers manually, the component renders the email verification section.
 * The component redirects the user to the account page successful sign-in.
 *
 * @param {Array<Object>} users - The users registered on this app.
 * @returns {JSX.Element} A React JSX element that displays the sign-in page.
 */
export default function SignIn({ users }) {
  const { user } = useAuth(); // Retrieve current user from Auth context
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const [email, setEmail] = useState("");
  const [isUserNew, setIsUserNew] = useState(false); // State hook for tracking whether the user is new or not
  const [isUserLoaded, setIsUserLoaded] = useState(false); // State hook for tracking whether the user data has been loaded or not
  const emailRef = useRef("");
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If the user is authenticated and their email is verified and the user is loaded
      if (user && user.emailVerified && isUserLoaded) {
        // Notify user of successful sign in and redirect to account page
        toast.success("Sign in successful.");
        router.push("/account");
      } else if (user && !user.emailVerified) {
        /*
        If the user is authenticated but his email is not verified yet,
        keep checking for email verification for every 2 seconds
        */
        let interval = setInterval(async () => {
          if (user.emailVerified) {
            // If the email is verified, clear interval, sign user out, and notify user of success
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

    unsubscribe(); // Unsubscribe from onAuthStateChanged listener
  }, [user, isUserLoaded, setIsPageLoading, router]);

  // Function to validate email field
  const emailValidation = () => {
    if (!emailRef?.current?.value) {
      toast.error("Email field cannot be empty.");
      return;
    } else if (!(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(emailRef?.current?.value))) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setEmail(emailRef?.current?.value);
  };

  // Function to check if user has registered with Google only
  const isProviderOnlyGoogle = () => {
    const [user] = users.filter((user) => user.email === email);

    if (user.registrationMethod === "google.com" && !user.linked) {
      return true;
    } else {
      return false;
    }
  };

  return (
    /* Main container with a dynamic height and grid layout based on screen size */
    <main className="sm:min-h-[66.66vh] sm:grid sm:grid-cols-5 md:min-h-[82vh] lg:min-h-[calc(100vh_-_6.5rem)] xl:min-h-[95vh] lg:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-3">
      <Head>
        {/* Dynamically generated title based on user's current sign in progress */}
        <title>
          {!user ? (
            /* If user is not signed in, check if email is provided and no user with this email exists */
            `${(email && users.every((user) => user.email !== email)) ? "Register" : "Sign in"} | Game On`
          ) : (
            /* If user is signed in but email is not verified */
            !user.emailVerified && "Verify Email | Game On"
          )}
        </title>
      </Head>
      {/*
      --Quote with background image section--
      Hide (extra small screen), or position on left column (smaller screens) or right column (larger screns) based on screen size
      */}
      <div className="hidden p-10 bg-[linear-gradient(rgba(227,14,48,0.85),rgba(227,14,48,0.85)),url('/community-controller.jpg')] bg-no-repeat bg-cover bg-center sm:col-span-2 sm:flex sm:flex-col sm:justify-center md:p-14 lg:col-span-1 xl:col-span-3 xl:order-2 2xl:col-span-2">
        <div className="space-y-3 xl:w-[60%] xl:mx-auto xl:space-y-4 2xl:w-1/3">
          <p className="relative text-[#cfcfcf] xl:text-lg"><span className="absolute -top-14 -left-4 text-9xl text-[#dd7878] xl:-top-16 xl:-left-7 xl:text-[10rem]">&quot;</span>Joining a gaming community is like finding a second family, one that shares your passion for gaming.</p>
          <h2 className="font-semibold text-2xl text-right text-[#f1f1f1] xl:text-3xl">- Game On</h2>
        </div>
      </div>
      {/* Render different component for different user state (positioned on right column for smaller screens, and left column for larger screns) */}
      {!user ? (
        // If user is not signed in
        // --Sign in section--
        <section className="px-6 pt-7 pb-14 space-y-20 sm:col-span-3 sm:flex sm:flex-col sm:justify-between sm:px-10 md:px-14 lg:col-span-1 xl:col-span-2 xl:pl-24 2xl:col-span-1 2xl:pl-32">
          {/* Manual sign in section */}
          <div className="space-y-8">
            {isUserNew && (!email || (email && users.some((user) => user.email === email))) && (
              /* Render only if user just registered and email is not provided or already exists in database */
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Registration Complete!</h2>
                <p>You have successfully created your account. Now, you can sign in to your new account using the credentials you provided.</p>
              </div>
            )}
            {!email ? (
              /* If email is not provided */
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
                    className="secondary-btn w-full h-12"
                    type="button"
                    onClick={() => emailValidation()}
                  >
                    <p>Next</p>
                    <IoChevronForward size={13} color="#1f1f1f" />
                  </button>
                </div>
              </div>
            ) : (
              /* If email is provided */
              users.every((user) => user.email !== email) ? (
                /* If email is not registered (doesn't exist in database) */
                <Register
                  email={email}
                  setEmail={setEmail}
                />
              ) : (
                /* If email is already registered (already exists in database) */
                isProviderOnlyGoogle() ? (
                  /* If email is only registered with Google provider */
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">
                        Can&apos;t Sign in with Password
                      </h2>
                      <p>The email address you provided was used to sign in with Google provider last time. In case you provided the wrong email address, you can go back and provide the correct one, otherwise, sign in with Google.</p>
                    </div>
                    <button
                      className="secondary-btn w-full h-12"
                      type="button"
                      onClick={() => setEmail("")}
                    >
                      <IoChevronBack size={13} color="#1f1f1f" />
                      <p className="font-semibold">Back</p>
                    </button>
                  </div>
                ) : (
                  /*
                  If email is registered with email and password provider
                  Does not matter if email is registered with Google provider or not
                  */
                  <EmailAndPasswordSignIn
                    email={email}
                    setEmail={setEmail}
                    setIsUserLoaded={setIsUserLoaded}
                  />
                )
              )
            )}
          </div>
          {/* --Google sign in section-- */}
          <div className="space-y-8">
            {/* Divider line between sign in section and Google sign section */}
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
      ) : (
        /* If user is signed in */
        !user.emailVerified && (
          // If email address is not verified
          // --Email verification section--
          <section className="px-6 pt-7 pb-14 space-y-10 sm:col-span-3 sm:px-10 md:px-14 lg:col-span-1 xl:col-span-2 xl:pl-24 2xl:col-span-1 2xl:pl-32">
            <Verification user={user} />
          </section>
        )
      )}
    </main>
  );
}

/*
 * Retrieves data for all users from Firestore during server-side rendering after checking user authentication.
 * 
 * @param {Object} context - The context object containing information about the incoming HTTP request.
 * @returns {Object} The server-side props containing data for all users.
 * @returns {Object} The server-side redirect when user email is not verified.
 * @throws {Object} The server-side redirect containing the redirection destination in case of an error.
 */
export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context); // Retrieve cookies from the incoming request

    if (cookies.token) {
      // If user already has a token, verify it with Firebase Admin SDK
      const adminAuth = getAuth(adminApp);
      const token = await adminAuth.verifyIdToken(cookies.token);

      // Redirect to account page if user's email is verified
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

    // Retrieve all users from the database
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => {
      return { ...doc.data() }
    });

    // Return the users data as props for the page
    return {
      props: {
        users
      }
    }
  } catch (error) {
    console.log(error);

    // Redirect to homepage if an error occurs
    return {
      redirect: {
        destination: "/home",
        permanent: false
      }
    };
  }
}
