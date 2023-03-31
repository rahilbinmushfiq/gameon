import { useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { IoChevronBack } from "react-icons/io5";
import { auth } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import ForgotPassword from "./forgotPassword";

export default function EmailAndPasswordSignIn({ email, setEmail, setIsUserLoaded }) {
  const { setIsPageLoading } = useLoading();
  const passwordRef = useRef("");

  const handleSignIn = async (event) => {
    event.preventDefault();

    let password = passwordRef?.current?.value;

    if (!password) {
      toast.error("Password field cannot be empty.");
      return;
    }

    setIsPageLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsUserLoaded(true);
    setIsPageLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1>Sign in</h1>
        <p>Input your password to sign in to your account.</p>
      </div>
      <form className="space-y-8 [&>div]:space-y-4" onSubmit={handleSignIn}>
        <div>
          <input
            className="typing-input"
            ref={passwordRef}
            type="password"
            placeholder="Enter your password"
            autoFocus
          />
          <ForgotPassword email={email} />
        </div>
        <div className="[&>button]:w-full [&>button]:h-12">
          <button className="secondary-btn" type="button" onClick={() => setEmail("")}>
            <IoChevronBack size={13} color="#1f1f1f" />
            <p>Back</p>
          </button>
          <button className="primary-btn">
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}