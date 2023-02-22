import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../config/firebase";
import Register from "../components/signIn/register";
import Verification from "../components/signIn/verification";
import EmailAndPasswordSignIn from "../components/signIn/emailAndPasswordSignIn";
import GoogleSignIn from "../components/signIn/googleSignIn";

export default function SignIn({ users }) {
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [isUserNew, setIsUserNew] = useState(false);

  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isUserNew && user && user.emailVerified) {
    router.push("/");
  }

  if (user && !user.emailVerified) {
    let interval = setInterval(async () => {
      if (user.emailVerified) {
        clearInterval(interval);
        auth.signOut();
        setIsUserNew(true);
        setEmail("");
      }
      await user.reload();
    }, 2000);
  }

  return (
    <main>
      {!user && (
        <section>
          {isUserNew && (
            <p>Your account creation is complete! Now, you can sign in to your new account.</p>
          )}
          <h1 className="text-3xl underline mb-3">Sign In</h1>
          {email === "" &&
            (<div className="flex flex-col w-fit gap-4">
              <input className="border border-neutral-900 w-[15rem] h-8" ref={emailRef} type="text" placeholder="Enter your email" onKeyUp={(e) => e.key === "Enter" && setEmail(emailRef?.current?.value)} autoFocus />
              <button className="text-white bg-neutral-900 w-[5rem] h-8" type="button" onClick={() => setEmail(emailRef?.current?.value)}>Next</button>
            </div>)}
          {email !== "" && users.some((user) => user.email === email) && (
            <EmailAndPasswordSignIn
              email={email}
              setEmail={setEmail}
              passwordRef={passwordRef}
              isUserNew={isUserNew}
              setIsUserNew={setIsUserNew}
            />
          )}
          {email !== "" && users.every((user) => user.email !== email) && (
            <Register
              fullNameRef={fullNameRef}
              passwordRef={passwordRef}
              confirmPasswordRef={confirmPasswordRef}
              email={email}
              setEmail={setEmail}
            />
          )}
          <GoogleSignIn />
        </section>)}
      {user && !user.emailVerified && (
        <section className="flex flex-col gap-2">
          <Verification user={user} />
        </section>
      )}
    </main>
  );
}

export async function getServerSideProps() {
  const usersCollectionRef = collection(db, "users");
  const response = await getDocs(usersCollectionRef);

  const users = response.docs.map((doc) => {
    return { ...doc.data() }
  })

  return {
    props: {
      users
    }
  }
}
