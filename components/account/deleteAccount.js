import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db, googleProvider } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";

export default function DeleteAccount({ user, signInProvider }) {
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const passwordRef = useRef("");

  const deleteUserAccount = async () => {
    try {
      if (signInProvider === "password") {
        let password = passwordRef?.current?.value;
        let credential = EmailAuthProvider.credential(user.email, password);

        await reauthenticateWithCredential(user, credential);
      } else {
        try {
          await reauthenticateWithPopup(user, googleProvider);
        } catch (reauthenticationError) {
          console.log(createErrorMessage(reauthenticationError));
        }
      }

      try {
        try {
          await deleteDoc(doc(db, "users", user.uid));
        } catch (deleteDocError) {
          console.log(createErrorMessage(deleteDocError));
        }

        await deleteUser(user);

        console.log("Account Deleted!");
      } catch (deleteAccountError) {
        console.log(createErrorMessage(deleteAccountError));
      }
    } catch (reauthenticationError) {
      console.log(createErrorMessage(reauthenticationError));
    }
  }

  if (user) return (
    <section className="pt-6">
      <button
        className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
        onClick={() => setIsDeleteAccountModalOpen(true)}
      >
        Delete Account
      </button>
      {isDeleteAccountModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md flex justify-center items-center"
          id="delete-account-modal-bg"
          onClick={(event) => event.target.id === "delete-account-modal-bg" && setIsDeleteAccountModalOpen(false)}
        >
          <div className="w-full mx-6 p-8 rounded-md space-y-4 bg-[#1f1f1f]">
            <h2 className="text-lg font-bold">Delete your account</h2>
            <div className="space-y-4 mb-12">
              {signInProvider === "password" ? (
                <input
                  className="sign-in--input mb-10"
                  ref={passwordRef}
                  type="password"
                  placeholder="Enter your password"
                  autoFocus
                  onKeyUp={(event) => event.key === "Enter" && deleteUserAccount()}
                />
              ) : (
                <p className="text-[#a9a9a9] mb-10">
                  After you press the confirm button, you need to be re-authenticated to make sure you're the owner of this account.
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
                  onClick={deleteUserAccount}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}