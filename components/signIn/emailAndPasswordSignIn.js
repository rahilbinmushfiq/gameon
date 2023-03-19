import createErrorMessage from "../../utils/createErrorMessage";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IoChevronBack } from "react-icons/io5";
import ForgotPassword from "./forgotPassword";
import { toast } from "react-toastify";
import { useRef } from "react";

export default function EmailAndPasswordSignIn({ email, setEmail, setIsUserLoaded }) {
  const passwordRef = useRef("");

  const handleSignIn = async (event) => {
    event.preventDefault();

    let password = passwordRef?.current?.value;

    if (!password) {
      toast.error("Password field cannot be empty.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsUserLoaded(true);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-[#f1f1f1]">Sign in</h1>
        <p className="text-[#a9a9a9]">
          Input your password to sign in to your account.
        </p>
      </div>
      <form className="space-y-8 pb-12" onSubmit={handleSignIn}>
        <div className="space-y-4">
          <input
            className="sign-in--input"
            ref={passwordRef}
            type="password"
            placeholder="Enter your password"
            autoFocus
          />
          <ForgotPassword email={email} />
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
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}