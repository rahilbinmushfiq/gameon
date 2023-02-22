import { auth, db, googleProvider } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function GoogleSignIn() {
    const handleGoogleSignIn = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);

            try {
                await setDoc(doc(db, "users", userCredential?.user?.uid), {
                    email: userCredential?.user?.email,
                    fullName: userCredential?.user?.displayName,
                    photoURL: userCredential?.user?.photoURL
                });
            } catch (docError) {
                console.log(createErrorMessage(docError));
            }
        } catch (signInError) {
            console.log(createErrorMessage(signInError));
        }
    }

    return (
        <button className="text-white bg-neutral-900 mt-12 w-[15rem] h-10 mx-auto align-middle justify-self-center" onClick={handleGoogleSignIn}>
            Sign in with Google
        </button>
    )
}