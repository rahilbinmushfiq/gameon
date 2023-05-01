import { useRef } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { HiLockClosed, HiUser } from "react-icons/hi";
import { IoChevronBack } from "react-icons/io5";
import { auth, db } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";

/*
 * Component for rendering the registration form on the Sign in page, which allows users to create their account with email and password. The component is rendered when a user has already entered their email address and no match is found for that email address in the database; indicating that the user is new and wants to create a new account.
 * 
 * The form contains three input fields to enter their full name, password and confirm password, a cancel button to clear the form fields, and a create account button to submit the form, along with the email address which is already provided by the user in the previous step.
 * 
 * @param {string} email - The email state which holds the email address entered by the user.
 * @param {function} setEmail - A function to update the email state.
 * 
 * @returns {JSX.Element} A JSX element that renders the registration form on the Sign-in page.
 */
export default function Register({ email, setEmail }) {
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const fullNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  // Function that handles registration form submission
  const handleRegister = async (event) => {
    event.preventDefault();

    // Retrieve user input values from 'useRef' state
    let fullName = fullNameRef?.current?.value;
    let password = passwordRef?.current?.value;
    let confirmPassword = confirmPasswordRef?.current?.value;

    // Validate form inputs
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
      // Attempt to create user account with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile with full name and default photo
      await updateProfile(userCredential?.user, {
        displayName: fullName,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/gameon-game-database.appspot.com/o/userPhotos%2Fdefault%2Fdefault_user.png?alt=media&token=d0ac1eec-2da7-44c6-b969-094cebdba599"
      });

      // Add user data to database
      await setDoc(doc(db, "users", userCredential?.user?.uid), {
        email: email,
        fullName: fullName,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/gameon-game-database.appspot.com/o/userPhotos%2Fdefault%2Fdefault_user.png?alt=media&token=d0ac1eec-2da7-44c6-b969-094cebdba599", // default user photo
        registrationMethod: "password",
        linked: false
      });

      // Send email verification to new user
      await sendEmailVerification(userCredential.user);

      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  return (
    // Register form container
    <div className="space-y-8">
      {/* The register form header and subtitle */}
      <div className="space-y-2">
        <h1>Register</h1>
        <p>Fill up the form to create your account.</p>
      </div>
      {/* The form that handles user registration */}
      <form className="space-y-8" onSubmit={handleRegister}>
        {/* Registration form input fields */}
        <div className="space-y-4 [&>div>input]:typing-input [&>div>input]:pl-12">
          <div className="relative">
            <input
              className="peer"
              ref={fullNameRef}
              type="text"
              placeholder="Enter your full name"
              autoFocus
            />
            <HiUser
              className="typing-input--icon"
              size={48}
              onClick={() => fullNameRef.current.focus()}
            />
          </div>
          <div className="relative">
            <input
              className="peer"
              ref={passwordRef}
              type="password"
              placeholder="Enter your password"
            />
            <HiLockClosed
              className="typing-input--icon"
              size={48}
              onClick={() => passwordRef.current.focus()}
            />
          </div>
          <div className="relative">
            <input
              className="peer"
              ref={confirmPasswordRef}
              type="password"
              placeholder="Confirm your password"
            />
            <HiLockClosed
              className="typing-input--icon"
              size={48}
              onClick={() => confirmPasswordRef.current.focus()}
            />
          </div>
        </div>
        {/* Registration form buttons */}
        <div className="space-y-4 [&>button]:w-full [&>button]:h-12">
          <button className="secondary-btn" type="button" onClick={() => setEmail("")}>
            <IoChevronBack size={13} color="#1f1f1f" />
            <p>Back</p>
          </button>
          <button className="primary-btn hover:bg-[#fe0303]">
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
