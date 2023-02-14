import { auth, googleProvider, db } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/router";
import { collection, getDocs, addDoc } from "firebase/firestore"
import { useState, useRef } from 'react';

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

    await signInWithEmailAndPassword(auth, email, password);

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
      await addDoc(usersCollectionRef, { email, fullName, userUID: data.user?.uid, photoURL: data.user?.photoURL });
    } catch (error) {
      console.log(error);
      return;
    }

    router.push('/');
  }

  const handleGoogleSignIn = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      await addDoc(usersCollectionRef, { email: data.user?.email, fullName: data.user?.displayName, userUID: data.user?.uid, photoURL: data.user?.photoURL });
    } catch (error) {
      console.log(error);
    }

    router.push('/');
  }

  return (
    <main>
      {!user && (
        <section>
          <h1 className="text-3xl underline mb-3">Sign In</h1>
          {email === "" &&
            (<div>
              <input ref={emailRef} type="text" placeholder="Enter your email" />
              <button type="button" className="text-white bg-blue-400" onClick={() => setEmail(emailRef.current.value)}>Next</button>
            </div>)}
          {email !== "" && users.some((user) => user.email === email) &&
            (<div>
              <input ref={passwordRef} type="password" placeholder="Enter your password" />
              <button type="button" className="mb-6 text-white bg-blue-400" onClick={() => setEmail("")}>Back</button>
              <button className="mb-6 text-white bg-blue-400" onClick={(e) => handleSignIn(e)}>Sign in</button>
            </div>)}
          {email !== "" && users.every((user) => user.email !== email) &&
            (<div>
              <input ref={fullNameRef} type="text" placeholder="Enter your full name" />
              <input ref={passwordRef} type="password" placeholder="Enter your password" />
              <input ref={confirmPasswordRef} type="password" placeholder="Confirm password" />
              <button type="button" className="mb-6 text-white bg-blue-400" onClick={() => setEmail("")}>Back</button>
              <button className="mb-6 text-white bg-blue-400" onClick={(e) => handleRegister(e)}>Create account</button>
            </div>)}
          <button className="text-white bg-blue-400" onClick={handleGoogleSignIn}>Sign in with Google</button>
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
