import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useRef, useState } from "react";
import createErrorMessage from "../../utils/createErrorMessage";

export default function UpdatePassword({ user }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");

  const updateUserPassword = async (event) => {
    event.preventDefault();

    let oldPassword = oldPasswordRef?.current?.value;
    let newPassword = newPasswordRef?.current?.value;

    if (oldPassword !== newPassword) {
      let credential = EmailAuthProvider.credential(user.email, oldPassword);

      try {
        await reauthenticateWithCredential(user, credential);

        try {
          await updatePassword(user, newPassword);
          setIsPasswordModalOpen(false);

          console.log("Password updated!");
        } catch (updatePasswordError) {
          console.log(createErrorMessage(updatePasswordError));
        }
      } catch (reauthenticationError) {
        console.log(createErrorMessage(reauthenticationError));
      }
    }
  }

  if (user) return (
    <section className="mt-16">
      <div className="flex justify-center items-center">
        <button
          className="text-white bg-neutral-900 w-[10rem] h-8"
          onClick={() => setIsPasswordModalOpen(true)}
        >
          Change Password
        </button>
      </div>
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black bg-opacity-25 backdrop-blur flex justify-center items-center"
          id="password-modal-bg"
          onClick={(event) => event.target.id === "password-modal-bg" && setIsPasswordModalOpen(false)}
        >
          <div className="w-[28rem] h-[18rem] flex flex-col justify-center items-center bg-white shadow-lg">
            <h2 className="mb-6 text-xl">Update your password</h2>
            <form className="flex flex-col gap-2" onSubmit={updateUserPassword}>
              <input
                className="border border-neutral-900 w-[15rem] h-8 px-2"
                ref={oldPasswordRef}
                type="password"
                placeholder="Old password"
                autoFocus
              />
              <input
                className="border border-neutral-900 w-[15rem] h-8 px-2"
                ref={newPasswordRef}
                type="password"
                placeholder="New password"
              />
              <div className="flex justify-between mt-6">
                <button
                  className="text-white bg-red-700 w-[5rem] h-8"
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="text-white bg-green-700 w-[5rem] h-8"
                  onClick={updateUserPassword}
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