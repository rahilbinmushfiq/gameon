import { auth, db, googleProvider } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";
import { signInWithPopup, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignIn({ users, setIsUserLoaded }) {
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      if (users.every((user) => user.email !== userCredential?.user?.email)) {
        try {
          await setDoc(doc(db, "users", userCredential?.user?.uid), {
            email: userCredential?.user?.email,
            fullName: userCredential?.user?.displayName,
            photoURL: userCredential?.user?.photoURL,
            registrationMethod: "google.com",
            linked: false
          });
        } catch (docError) {
          console.log(createErrorMessage(docError));
        }
      } else {
        const snapshot = await getDoc(doc(db, "users", userCredential?.user?.uid));

        if (snapshot.data().registrationMethod === "password" && !snapshot.data().linked) {
          try {
            await updateProfile(userCredential?.user, {
              displayName: snapshot.data().fullName,
              photoURL: snapshot.data().photoURL
            });
          } catch (updateProfileError) {
            console.log(createErrorMessage(updateProfileError));
            return;
          }

          try {
            await updateDoc(doc(db, "users", userCredential?.user?.uid), { linked: true });
          } catch (updateDocError) {
            console.log(createErrorMessage(updateDocError));
          }
        }
      }
    } catch (signInError) {
      console.log(createErrorMessage(signInError));
    }

    setIsUserLoaded(true);
  }

  return (
    <button className="flex gap-3 justify-center items-center w-full h-12 rounded-sm bg-[#3a3a3a]" onClick={handleGoogleSignIn}>
      <FcGoogle size={20} />
      <p className="font-semibold">Sign in with Google</p>
    </button>
  )
}