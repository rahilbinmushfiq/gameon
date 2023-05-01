import { signInWithPopup, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { auth, db, googleProvider } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";

/*
 * Renders a button on the Sign-in page that allows users to sign in with their Google account.
 * 
 * @param {Array<Object>} users - The users registered on this app.
 * @param {function} setIsUserLoaded - A function to set the loading state of user data.
 * 
 * @returns {JSX.Element} A JSX Element that displays the Google sign-in button on the Sign-in Page.
 */
export default function GoogleSignIn({ users, setIsUserLoaded }) {
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context

  const handleGoogleSignIn = async () => {
    setIsPageLoading(true);

    try {
      // Attempt to sign in with Google provider
      const userCredential = await signInWithPopup(auth, googleProvider);

      // Check if the user is registered (already exists in our database)
      if (users.every((user) => user.email !== userCredential?.user?.email)) {
        // If user is new, add their information to the database
        await setDoc(doc(db, "users", userCredential?.user?.uid), {
          email: userCredential?.user?.email,
          fullName: userCredential?.user?.displayName,
          photoURL: userCredential?.user?.photoURL,
          registrationMethod: "google.com",
          linked: false
        });
      } else {
        // If user exists in our database, retrieve the user data
        const snapshot = await getDoc(doc(db, "users", userCredential?.user?.uid));

        // If user has registered with email/password and not linked it to Google sign in yet
        if (snapshot.data().registrationMethod === "password" && !snapshot.data().linked) {
          // Update user profile with the display name and photo retrieved from the database
          await updateProfile(userCredential?.user, {
            displayName: snapshot.data().fullName,
            photoURL: snapshot.data().photoURL
          });

          // Update the user's linked status in the database
          await updateDoc(doc(db, "users", userCredential?.user?.uid), {
            linked: true
          });
        }
      }
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
    setIsUserLoaded(true);
  };

  return (
    // Render Google sign-in button
    <button
      className="w-full h-12 gap-3 bg-[#3a3a3a] hover:bg-[#f1f1f1] [&>p]:hover:text-[#1f1f1f]"
      onClick={handleGoogleSignIn}
    >
      <FcGoogle size={20} />
      <p className="text-[#f1f1f1] font-semibold">
        Sign in with Google
      </p>
    </button>
  );
}
