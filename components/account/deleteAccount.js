import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";

export default function DeleteAccount({ user }) {
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const passwordRef = useRef("");

  const deleteUserAccount = async () => {
    let password = passwordRef?.current?.value;
    let credential = EmailAuthProvider.credential(user.email, password);

    try {
      await reauthenticateWithCredential(user, credential);

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
    <section className="mt-16">
      <div className="flex justify-center items-center">
        <button
          className="text-white bg-neutral-900 w-[10rem] h-8"
          onClick={() => setIsDeleteAccountModalOpen(true)}
        >
          Delete Account
        </button>
      </div>
      {isDeleteAccountModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black bg-opacity-25 backdrop-blur flex justify-center items-center"
          id="delete-account-modal-bg"
          onClick={(event) => event.target.id === "delete-account-modal-bg" && setIsDeleteAccountModalOpen(false)}
        >
          <div className="w-[28rem] h-[16rem] flex flex-col justify-center items-center bg-white shadow-lg">
            <h2 className="mb-6 text-xl">Delete your account</h2>
            <div className="flex flex-col gap-2">
              <input
                className="border border-neutral-900 w-[15rem] h-8 px-2"
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
                onKeyUp={(event) => event.key === "Enter" && deleteUserAccount()}
              />
              <div className="flex justify-between mt-6">
                <button
                  className="text-white bg-red-700 w-[5rem] h-8"
                  type="button"
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="text-white bg-green-700 w-[5rem] h-8"
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