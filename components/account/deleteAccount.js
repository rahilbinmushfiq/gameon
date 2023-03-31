import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { db, googleProvider } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import { FaTrashAlt, FaChevronRight } from "react-icons/fa";

export default function DeleteAccount({ user, signInProvider }) {
  const { setIsPageLoading } = useLoading();
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const passwordRef = useRef("");

  const deleteUserAccount = async (event) => {
    event.preventDefault();

    setIsPageLoading(true);

    userDelete: try {
      if (signInProvider === "password") {
        let password = passwordRef?.current?.value;

        if (!password) {
          toast.error("Password field cannot be empty.");
          break userDelete;
        }

        let credential = EmailAuthProvider.credential(user.email, password);

        await reauthenticateWithCredential(user, credential);
      } else {
        await reauthenticateWithPopup(user, googleProvider);
      }

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      toast.success("Your account has been deleted.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  }

  if (user) return (
    <section>
      <button
        className="info-container info-container--hover"
        onClick={() => setIsDeleteAccountModalOpen(true)}
      >
        <div>
          <FaTrashAlt size={18} />
          <p>Delete Account</p>
        </div>
        <FaChevronRight size={14} color="#a9a9a9" />
      </button>
      {isDeleteAccountModalOpen && (
        <div
          className="modal-bg"
          id="delete-account-modal-bg"
          onClick={(event) => event.target.id === "delete-account-modal-bg" && setIsDeleteAccountModalOpen(false)}
        >
          <div className="mx-6 p-8 space-y-8 rounded-md bg-[#1f1f1f]">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Delete Your Account</h3>
              <p>
                {signInProvider === "google" ? "After you press the confirm button, you" : "You"} need to be re-authenticated to make sure you're the owner of this account.
              </p>
            </div>
            <form className="space-y-8" onSubmit={deleteUserAccount}>
              {signInProvider === "password" && (
                <input
                  className="typing-input"
                  ref={passwordRef}
                  type="password"
                  placeholder="Enter your password"
                  autoFocus
                />
              )}
              <div className="modal-btn-container">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="primary-btn">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}