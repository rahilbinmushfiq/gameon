import createErrorMessage from "../../utils/createErrorMessage";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRef } from "react";

export default function Register({ email, setEmail }) {
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential?.user, {
        displayName: fullName,
        photoURL: "https://180dc.org/wp-content/uploads/2016/08/default-profile.png"
      });

      await setDoc(doc(db, "users", userCredential?.user?.uid), {
        email: email,
        fullName: fullName,
        photoURL: "https://180dc.org/wp-content/uploads/2016/08/default-profile.png",
        registrationMethod: "password",
        linked: false
      });

      await sendEmailVerification(userCredential.user);

      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(createErrorMessage(error));
      return;
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-[#f1f1f1]">Register</h1>
        <p className="text-[#a9a9a9]">
          Fill up the form to create your account.
        </p>
      </div>
      <form className="space-y-10 pb-12" onSubmit={handleRegister}>
        <div className="space-y-6">
          <input
            className="sign-in--input"
            ref={fullNameRef}
            type="text"
            placeholder="Enter your full name"
            autoFocus
          />
          <input
            className="sign-in--input"
            ref={passwordRef}
            type="password"
            placeholder="Enter your password"
          />
          <input
            className="sign-in--input"
            ref={confirmPasswordRef}
            type="password"
            placeholder="Confirm your password"
          />
        </div>
        <div className="space-y-4">
          <button
            className="flex gap-2 justify-center items-center w-full h-12 rounded-sm text-[#1f1f1f] bg-[#f1f1f1]"
            type="button"
            onClick={() => setEmail("")}
          >
            <IoChevronBack size={13} color="#1f1f1f" />
            <p className="font-semibold">Back</p>
          </button>
          <button
            className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
            type="submit"
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  )
}