import { useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { HiLockClosed } from "react-icons/hi";
import { IoChevronBack } from "react-icons/io5";
import { auth } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import ForgotPassword from "./forgotPassword";

/*
 * Component for rendering the sign-in form on the Sign in page, which allows users to sign in with their email and password. The component is rendered when a user has already entered their email address and a match is found for that email address in the database; indicating that the user has already registered on the app and wants to sign in.
 * 
 * The form contains a password field, a forgot password button to reset the password if needed, a cancel button to clear the form fields, and a sign-in button to submit the form, along with the email address which is already provided by the user in the previous step.
 * 
 * @param {string} email - The email state which holds the email address entered by the user.
 * @param {function} setEmail - A function to update the email state.
 * @param {function} setIsUserLoaded - A function to set the loading state of user data.
 * 
 * @returns {JSX.Element} A JSX element that renders the sign-in form on the Sign-in page.
 */
export default function EmailAndPasswordSignIn({ email, setEmail, setIsUserLoaded }) {
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const passwordRef = useRef("");

  // Function that handles sign-in form submission
  const handleSignIn = async (event) => {
    event.preventDefault();

    let password = passwordRef?.current?.value;

    if (!password) {
      toast.error("Password field cannot be empty.");
      return;
    }

    setIsPageLoading(true);

    try {
      // Attempt to sign-in with email and password
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
    setIsUserLoaded(true);
  };

  return (
    /* Sign-in form container */
    <div className="space-y-8">
      {/* Render sign-in form header and subtitle */}
      <div className="space-y-2">
        <h1>Sign in</h1>
        <p>Input your password to sign in to your account.</p>
      </div>
      {/* Render sign-in form */}
      <form className="space-y-8 [&>div]:space-y-4" onSubmit={handleSignIn}>
        <div>
          {/* Render password input field with an icon */}
          <div className="relative">
            <input
              className="typing-input pl-12 peer"
              ref={passwordRef}
              type="password"
              placeholder="Enter your password"
              autoFocus
            />
            <HiLockClosed
              className="typing-input--icon"
              size={48}
              onClick={() => passwordRef.current.focus()}
            />
          </div>
          {/* Render Forgot Password component */}
          <ForgotPassword email={email} />
        </div>
        {/* Render sign-in form buttons */}
        <div className="[&>button]:w-full [&>button]:h-12">
          {/* Button to go back to the previous page */}
          <button className="secondary-btn" type="button" onClick={() => setEmail("")}>
            <IoChevronBack size={13} color="#1f1f1f" />
            <p>Back</p>
          </button>
          {/* Button to submit the form for signing in. */}
          <button className="primary-btn hover:bg-[#fe0303]">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
