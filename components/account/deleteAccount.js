import { useRef, useState } from "react";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { MdDelete, MdChevronRight } from "react-icons/md";
import { db, googleProvider } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import Modal from "../modal";

/*
 * Component for rendering the delete account button on the Account page, which allows authenticated users to delete their account. A user must be re-authenticated before performing this action.
 * 
 * @param {Object} user - The authenticated user.
 * @param {string} signInProvider - The sign-in provider of the user (either "google.com" or "password").
 * 
 * @returns {JSX.Element|null} Delete account section JSX, or null if user is not authenticated.
 */
export default function DeleteAccount({ user, signInProvider }) {
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false); // State hook for keeping track whether to show/hide the delete account modal
  const passwordRef = useRef("");

  // Function to handle user account deletion
  const deleteUserAccount = async (event) => {
    event.preventDefault();

    setIsPageLoading(true);

    userDelete: try {
      // If the user signed in with email/password provider
      if (signInProvider === "password") {
        let password = passwordRef?.current?.value;

        // Validate password input field
        if (!password) {
          toast.error("Password field cannot be empty.");
          break userDelete;
        }

        // Re-authenticate the user using credential
        let credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } else {
        // If the user signed in with Google provider, re-authenticate with Google
        await reauthenticateWithPopup(user, googleProvider);
      }

      // Delete the user from Firebase Authentication and database
      await deleteUser(user);
      await deleteDoc(doc(db, "users", user.uid));
      toast.success("Your account has been deleted.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  // If user is authenticated, render the delete account section
  if (user) return (
    /* --Delete account section-- */
    <section>
      {/* Button to open delete account modal */}
      <button
        className="info-container info-container--hover"
        onClick={() => setIsDeleteAccountModalOpen(true)}
      >
        <div>
          <MdDelete size={20} />
          <p>Delete Account</p>
        </div>
        <MdChevronRight size={22} color="#a9a9a9" />
      </button>
      {// If modal state is true, render the Modal component for deleting account
        isDeleteAccountModalOpen && (
          <Modal
            type="confirm"
            id="delete-account-modal-bg"
            heading="Delete Your Account"
            description={`${signInProvider === "google" ? "After you press the confirm button, you" : "You"} need to be re-authenticated to make sure you're the owner of this account.`}
            setIsModalOpen={setIsDeleteAccountModalOpen}
            handleSubmission={deleteUserAccount}
          >
            {// If user is signed in with email/password, render the password input field
              signInProvider === "password" && (
                <input
                  className="typing-input"
                  ref={passwordRef}
                  type="password"
                  placeholder="Enter your password"
                  autoFocus
                />
              )}
          </Modal>
        )}
    </section>
  );
}
