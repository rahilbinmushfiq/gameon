import createErrorMessage from "../../utils/createErrorMessage";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useLoading } from "../../contexts/loading";

export default function Register({ email, setEmail }) {
  const { setIsPageLoading } = useLoading();
  const fullNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const handleRegister = async (event) => {
    event.preventDefault();

    let fullName = fullNameRef?.current?.value;
    let password = passwordRef?.current?.value;
    let confirmPassword = confirmPasswordRef?.current?.value;

    if (!fullName || !password || !confirmPassword) {
      toast.error("Please fill up the form first.");
      return;
    } else if (!(/^[a-zA-Z.,\-\s]{3,}$/i.test(fullName))) {
      toast.error("Please provide a valid full name.");
      return;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsPageLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential?.user, {
        displayName: fullName,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/gameon-game-database.appspot.com/o/userPhotos%2Fdefault%2Fdefault_user.png?alt=media&token=d0ac1eec-2da7-44c6-b969-094cebdba599"
      });

      await setDoc(doc(db, "users", userCredential?.user?.uid), {
        email: email,
        fullName: fullName,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/gameon-game-database.appspot.com/o/userPhotos%2Fdefault%2Fdefault_user.png?alt=media&token=d0ac1eec-2da7-44c6-b969-094cebdba599",
        registrationMethod: "password",
        linked: false
      });

      await sendEmailVerification(userCredential.user);

      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1>Register</h1>
        <p>Fill up the form to create your account.</p>
      </div>
      <form className="space-y-8" onSubmit={handleRegister}>
        <div className="space-y-4 [&>input]:typing-input">
          <input
            ref={fullNameRef}
            type="text"
            placeholder="Enter your full name" autoFocus
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Enter your password"
          />
          <input
            ref={confirmPasswordRef}
            type="password"
            placeholder="Confirm your password"
          />
        </div>
        <div className="space-y-4 [&>button]:w-full [&>button]:h-12">
          <button className="secondary-btn" type="button" onClick={() => setEmail("")}>
            <IoChevronBack size={13} color="#1f1f1f" />
            <p>Back</p>
          </button>
          <button className="primary-btn">
            Create account
          </button>
        </div>
      </form>
    </div>
  )
}