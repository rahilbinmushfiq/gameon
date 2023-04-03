import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { db, googleProvider } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import { MdDelete, MdChevronRight } from "react-icons/md";
import Modal from "../modal";

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
          <MdDelete size={20} />
          <p>Delete Account</p>
        </div>
        <MdChevronRight size={22} color="#a9a9a9" />
      </button>
      {isDeleteAccountModalOpen && (
        <Modal
          type="confirm"
          id="delete-account-modal-bg"
          heading="Delete Your Account"
          description={`${signInProvider === "google" ? "After you press the confirm button, you" : "You"} need to be re-authenticated to make sure you're the owner of this account.`}
          setIsModalOpen={setIsDeleteAccountModalOpen}
          handleSubmission={deleteUserAccount}
        >
          {signInProvider === "password" && (
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
  )
}