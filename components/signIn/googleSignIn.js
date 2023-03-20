import { auth, db, googleProvider } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";
import { signInWithPopup, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useLoading } from "../../contexts/loading";

export default function GoogleSignIn({ users, setIsUserLoaded }) {
  const { setIsPageLoading } = useLoading();

  const handleGoogleSignIn = async () => {
    setIsPageLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      if (users.every((user) => user.email !== userCredential?.user?.email)) {
        await setDoc(doc(db, "users", userCredential?.user?.uid), {
          email: userCredential?.user?.email,
          fullName: userCredential?.user?.displayName,
          photoURL: userCredential?.user?.photoURL,
          registrationMethod: "google.com",
          linked: false
        });
      } else {
        const snapshot = await getDoc(doc(db, "users", userCredential?.user?.uid));

        if (snapshot.data().registrationMethod === "password" && !snapshot.data().linked) {
          await updateProfile(userCredential?.user, {
            displayName: snapshot.data().fullName,
            photoURL: snapshot.data().photoURL
          });

          await updateDoc(doc(db, "users", userCredential?.user?.uid), { linked: true });
        }
      }
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsUserLoaded(true);
    setIsPageLoading(false);
  }

  return (
    <button className="flex gap-3 justify-center items-center w-full h-12 rounded-sm bg-[#3a3a3a]" onClick={handleGoogleSignIn}>
      <FcGoogle size={20} />
      <p className="font-semibold">Sign in with Google</p>
    </button>
  )
}