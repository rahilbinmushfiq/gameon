import { EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword } from "firebase/auth";
import { useRef, useState } from "react";
import { googleProvider } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";

export default function UpdatePassword({ user, signInProvider }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const firstPasswordRef = useRef("");
  const secondPasswordRef = useRef("");

  //console.log(signInProvider);
  //console.log(user)

  const isPasswordProviderPresent = () => {
    return user?.providerData.some(provider => provider.providerId.includes("password"))
  }

  //console.log(isPasswordProviderPresent())

  const updateUserPassword = async (event) => {
    event.preventDefault();

    let oldPassword = firstPasswordRef?.current?.value;
    let newPassword = secondPasswordRef?.current?.value;

    if (isPasswordProviderPresent()) {
      if (signInProvider === "password") {

        let credential = EmailAuthProvider.credential(user.email, oldPassword);

        try {
          await reauthenticateWithCredential(user, credential);
        } catch (reauthenticationError) {
          console.log(createErrorMessage(reauthenticationError));
          return;
        }
      } else {
        try {
          await reauthenticateWithPopup(user, googleProvider);
        } catch (reauthenticationError) {
          console.log(reauthenticationError);
          return;
        }
      }

      if (oldPassword === newPassword) {
        console.log("Your previous password and the new password are same.");
        return;
      }

      try {
        await updatePassword(user, newPassword);
        setIsPasswordModalOpen(false);

        console.log("Password updated!");
      } catch (updatePasswordError) {
        console.log("updatePasswordError: ", updatePasswordError);
      }


    } else {
      let password = firstPasswordRef?.current?.value;
      let confirmPassword = secondPasswordRef?.current?.value;

      if (password === confirmPassword) {
        let credential = EmailAuthProvider.credential(user.email, password);

        try {
          await reauthenticateWithPopup(user, googleProvider);

          try {
            await linkWithCredential(user, credential);
            setIsPasswordModalOpen(false);

            console.log("Password added!");
          } catch (addPasswordError) {
            console.log(createErrorMessage(addPasswordError));
          }
        } catch (reauthenticationError) {
          console.log(createErrorMessage(reauthenticationError));
        }
      } else {
        console.log("Passwords do not match.");
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
          {`${isPasswordProviderPresent() ? "Change" : "Add"} password`}
        </button>
      </div>
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black bg-opacity-25 backdrop-blur flex justify-center items-center"
          id="password-modal-bg"
          onClick={(event) => event.target.id === "password-modal-bg" && setIsPasswordModalOpen(false)}
        >
          <div className="w-[28rem] h-[18rem] flex flex-col justify-center items-center bg-white shadow-lg">
            <h2 className="mb-6 text-xl">{`${isPasswordProviderPresent() ? "Update your" : "Add"}`} password</h2>
            <form className="flex flex-col gap-2 items-center" onSubmit={updateUserPassword}>
              {signInProvider === "google.com" && (
                <p className="max-w-sm">
                  After you press the {`${isPasswordProviderPresent() ? "update" : "add"}`} button, a pop-up will appear asking you to sign in with your email.
                </p>
              )}
              {!(signInProvider === "google.com" && isPasswordProviderPresent()) && (
                <input
                  className="border border-neutral-900 w-[15rem] h-8 px-2"
                  ref={firstPasswordRef}
                  type="password"
                  placeholder={`${isPasswordProviderPresent() ? "Old password" : "Password"}`}
                  autoFocus
                />
              )}
              <input
                className="border border-neutral-900 w-[15rem] h-8 px-2"
                ref={secondPasswordRef}
                type="password"
                placeholder={`${isPasswordProviderPresent() ? "New password" : "Confirm password"}`}
              />
              <div className="flex gap-6 mt-6">
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
                  {`${isPasswordProviderPresent() ? "Update" : "Add"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}