import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/router";

export default function SignIn() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if (loading) {
    return <h1>loading...</h1>
  }

  if (user) {
    router.push('/')
  }

  const handleGoogleSignIn = async () => {
    try {
      const loggedInUser = await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      {!user && (<section>
        <h1 className="text-3xl underline">Sign In</h1>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </section>)}
    </main>
  );
}
