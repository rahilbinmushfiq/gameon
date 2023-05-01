import { EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { db, googleProvider } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import { MdKey, MdChevronRight } from "react-icons/md";
import Modal from "../modal";

/*
 * Component for rendering the update or add password button on the Account page depending on the user's sign-in provider. This component allows the user to change their password if they have a password provider or add a password to their account if they signed in with Google and haven't linked the password provider.
 * 
 * @param {Object} user - The authenticated user.
 * @param {string} signInProvider - The sign-in provider of the user (either "google.com" or "password").
 * 
 * @returns {JSX.Element|null} Update password section JSX, or null if user is not authenticated.
 */
export default function UpdatePassword({ user, signInProvider }) {
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // State hook for keeping track whether to show/hide the update password modal
  const firstPasswordRef = useRef("");
  const secondPasswordRef = useRef("");

  /**
   * Determines if the user has a password provider linked to their account.
   *
   * @returns {boolean} - Returns true if the user has a password provider, and false otherwise.
   */
  const isPasswordProviderPresent = () => {
    return user?.providerData.some(provider => provider.providerId.includes("password"));
  };

  // Function to update user password
  const updateUserPassword = async (event) => {
    event.preventDefault();

    setIsPageLoading(true);

    passwordUpdate: try {
      // If user has a password provider
      if (isPasswordProviderPresent()) {
        let oldPassword = firstPasswordRef?.current?.value;
        let newPassword = secondPasswordRef?.current?.value;

        // If sign in provider is email/password
        if (signInProvider === "password") {
          // Validate form inputs
          if (!oldPassword || !newPassword) {
            toast.error("Please fill up the form first.");
            break passwordUpdate;
          } else if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            break passwordUpdate;
          }

          // Reauthenticate user with old password
          let credential = EmailAuthProvider.credential(user.email, oldPassword);
          await reauthenticateWithCredential(user, credential);

          // Check if old and new passwords are same
          if (oldPassword === newPassword) {
            toast.error("Your old and new passwords are same.");
            break passwordUpdate;
          }
        } else {
          // If sign in provider is Google

          // Validate new password input field
          if (!newPassword) {
            toast.error("Please fill up the form first.");
            break passwordUpdate;
          } else if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            break passwordUpdate;
          }

          // Reauthenticate user with Google provider
          await reauthenticateWithPopup(user, googleProvider);
        }

        // Update user password in Firebase Authentication
        await updatePassword(user, newPassword);

        setIsPasswordModalOpen(false); // Close update password modal
        toast.success("Password updated!");
      } else {
        // If user doesn't have a password provider

        let password = firstPasswordRef?.current?.value;
        let confirmPassword = secondPasswordRef?.current?.value;

        // Validate form inputs
        if (!password || !confirmPassword) {
          toast.error("Please fill up the form first.");
          break passwordUpdate;
        } else if (password.length < 6) {
          toast.error("Password must be at least 6 characters long.");
          break passwordUpdate;
        } else if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          break passwordUpdate;
        }
        // Reauthenticate user with Google Sign-In
        await reauthenticateWithPopup(user, googleProvider);

        // Link user's Google account with email/password credential
        let credential = EmailAuthProvider.credential(user.email, password);
        await linkWithCredential(user, credential);

        // Update user's linked status in the database
        await updateDoc(doc(db, "users", user.uid), {
          linked: true
        });

        setIsPasswordModalOpen(false); // Close update password modal
        toast.success("Password added. Now, you can sign in with email and password.");
      }
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  // If user is authenticated, render the update password section
  if (user) return (
    /* --Update password section-- */
    <section>
      {/* Button to open update password modal */}
      <button
        className="info-container info-container--hover"
        onClick={() => setIsPasswordModalOpen(true)}
      >
        <div>
          <MdKey size={20} />
          {/* Depending on whether user has a password provider or not, display "Change Password" or "Add Password" text */}
          <p>{isPasswordProviderPresent() ? "Change" : "Add"} Password</p>
        </div>
        <MdChevronRight size={22} color="#a9a9a9" />
      </button>
      {/* If modal state is true, render the Modal component for updating user password */
        isPasswordModalOpen && (
          <Modal
            type="confirm"
            id="update-password-modal-bg"
            heading={`${isPasswordProviderPresent() ? "Update" : "Add"} Password`}
            // Show different subtitle depending on the sign-in provider
            description={signInProvider === "google.com" ? (
              // If sign-in provider is Google
              `After you press the "Confirm" button, a pop-up will appear asking you to sign in with your email.`
            ) : (
              // If sign-in provider is email/password
              "Make sure that your new password is at least 6 characters long."
            )}
            setIsModalOpen={setIsPasswordModalOpen}
            handleSubmission={updateUserPassword}
          >
            <div className="space-y-4 [&>input]:typing-input">
              {/*
              Hide this password input field only if the user has signed in with Google
              and already linked the password provider to their account,
              otherwise, show this input field.
              */}
              {!(signInProvider === "google.com" && isPasswordProviderPresent()) && (
                <input
                  ref={firstPasswordRef}
                  type="password"
                  // Dynamic placeholder depending whether user has a password provider or not
                  placeholder={isPasswordProviderPresent() ? "Old password" : "Password"}
                  autoFocus
                />
              )}
              {/*
              Regardless of the user's sign-in provider and provider linked status,
              always show this password input field.
              */}
              <input
                ref={secondPasswordRef}
                type="password"
                // Dynamic placeholder depending on whether user has a password provider or not
                placeholder={isPasswordProviderPresent() ? "New password" : "Confirm password"}
                // If the sign-in provider is Google and a password is present, set the focus on this input
                autoFocus={signInProvider === "google.com" && isPasswordProviderPresent()}
              />
            </div>
          </Modal>
        )
      }
    </section>
  );
}
