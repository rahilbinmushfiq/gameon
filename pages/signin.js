import { auth, googleProvider, db } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/router";
import { collection, getDocs, addDoc } from "firebase/firestore"
import { useState, useRef } from 'react';
import createErrorMessage from "../utils/createErrorMessage";

export default function SignIn({ users }) {
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [isUserNew, setIsUserNew] = useState(false);

  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const usersCollectionRef = collection(db, "users");
  const router = useRouter();

  if (loading) {
    return;
  }

  if (user) {
    router.push('/');
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    let password = passwordRef?.current?.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(createErrorMessage(error));
      return;
    }

    router.push('/');
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    let password = passwordRef?.current?.value;
    let confirmPassword = confirmPasswordRef?.current?.value;
    let fullName = fullNameRef?.current?.value;

    if (password != confirmPassword) {
      console.log("passwords do not match.");
      return;
    }

    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);

      try {
        await addDoc(usersCollectionRef, { email, fullName, userUID: data.user?.uid, photoURL: data.user?.photoURL });
      } catch (docError) {
        console.log(createErrorMessage(docError));
      }
    } catch (signUpError) {
      console.log(createErrorMessage(signUpError));
      return;
    }

    router.push('/');
  }

  const handleGoogleSignIn = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      await addDoc(usersCollectionRef, { email: data.user?.email, fullName: data.user?.displayName, userUID: data.user?.uid, photoURL: data.user?.photoURL });
    } catch (error) {
      console.log(createErrorMessage(error));
    }

    router.push('/');
  }

  return (
    <main>
      {!user && (
        <section>
          <h1 className="text-3xl underline mb-3">Sign In</h1>
          {email === "" &&
            (<div className="flex flex-col w-fit gap-4">
              <input className="border border-neutral-900 w-[15rem] h-8" ref={emailRef} type="text" placeholder="Enter your email" onKeyUp={(e) => e.key === "Enter" && setEmail(emailRef?.current?.value)} autoFocus />
              <button className="text-white bg-neutral-900 w-[5rem] h-8" type="button" onClick={() => setEmail(emailRef?.current?.value)}>Next</button>
            </div>)}
          {email !== "" && users.some((user) => user.email === email) &&
            (<form className="flex flex-col w-fit gap-4" onSubmit={(e) => handleRegister(e)}>
              <input className="border border-neutral-900 w-[15rem] h-8" ref={passwordRef} type="password" placeholder="Enter your password" autoFocus />
              <div className="flex justify-between">
                <button className="text-white bg-neutral-900 w-[5rem] h-8" type="button" onClick={() => setEmail("")}>Back</button>
                <button className="text-white bg-neutral-900 w-[5rem] h-8" onClick={(e) => handleSignIn(e)}>Sign in</button>
              </div>
            </form>)}
          {email !== "" && users.every((user) => user.email !== email) &&
            (<form className="flex flex-col w-fit gap-4" onSubmit={(e) => handleRegister(e)}>
              <input className="border border-neutral-900 w-[15rem] h-8" ref={fullNameRef} type="text" placeholder="Enter your full name" autoFocus />
              <input className="border border-neutral-900 w-[15rem] h-8" ref={passwordRef} type="password" placeholder="Enter your password" />
              <input className="border border-neutral-900 w-[15rem] h-8" ref={confirmPasswordRef} type="password" placeholder="Confirm password" />
              <div className="flex justify-between">
                <button className="text-white bg-neutral-900 w-[4rem] h-8" type="button" onClick={() => setEmail("")}>Back</button>
                <button className="text-white bg-neutral-900 w-[9rem] h-8" onClick={(e) => handleRegister(e)}>Create account</button>
              </div>
            </form>)}
          <button className="text-white bg-neutral-900 mt-12 w-[15rem] h-10 mx-auto align-middle justify-self-center" onClick={handleGoogleSignIn}>Sign in with Google</button>
        </section>)}
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
