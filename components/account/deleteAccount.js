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
        className="flex justify-between items-center w-full h-16 px-6 hover:bg-[#2a2a2a] [&>div>p]:hover:text-[#f1f1f1] [&>*]:hover:fill-[#f1f1f1]"
        onClick={() => setIsDeleteAccountModalOpen(true)}
      >
        <div className="flex gap-4 items-center">
          <FaTrashAlt size={18} color="#f1f1f1" />
          <p className="font-semibold text-[#a9a9a9]">Delete Account</p>
        </div>
        <FaChevronRight size={14} color="#a9a9a9" />
      </button>
      {isDeleteAccountModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md flex justify-center items-center"
          id="delete-account-modal-bg"
          onClick={(event) => event.target.id === "delete-account-modal-bg" && setIsDeleteAccountModalOpen(false)}
        >
          <div className="w-full mx-6 p-8 rounded-md space-y-4 bg-[#1f1f1f]">
            <div className="space-y-2">
              <h3 className="inline-block mb-1 text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
                Delete Your Account
              </h3>
              <p className="text-[#a9a9a9]">
                {signInProvider === "google" ? "After you press the confirm button, you" : "You"} need to be re-authenticated to make sure you're the owner of this account.
              </p>
            </div>
            <form className="space-y-10" onSubmit={deleteUserAccount}>
              {signInProvider === "password" && (
                <input
                  className="sign-in--input"
                  ref={passwordRef}
                  type="password"
                  placeholder="Enter your password"
                  autoFocus
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
                  type="button"
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
                >
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