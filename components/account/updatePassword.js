import { EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db, googleProvider } from "../../config/firebase";
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

            try {
              await updateDoc(doc(db, "users", user.uid), { linked: true });
            } catch (updateDocError) {
              console.log(createErrorMessage(updateDocError));
            }

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
    <section className="pt-10">
      <button
        className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
        onClick={() => setIsPasswordModalOpen(true)}
      >
        {`${isPasswordProviderPresent() ? "Change" : "Add"} password`}
      </button>
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md flex justify-center items-center"
          id="password-modal-bg"
          onClick={(event) => event.target.id === "password-modal-bg" && setIsPasswordModalOpen(false)}
        >
          <div className="mx-6 p-8 rounded-md space-y-4 bg-[#1f1f1f]">
            <h2 className="text-lg font-bold">{`${isPasswordProviderPresent() ? "Update your" : "Add"}`} password</h2>
            <form className="space-y-2" onSubmit={updateUserPassword}>
              {signInProvider === "google.com" && (
                <p className="text-[#a9a9a9] mb-4">
                  After you press the {`${isPasswordProviderPresent() ? "update" : "add"}`} button, a pop-up will appear asking you to sign in with your email.
                </p>
              )}
              <div className="space-y-4 mb-10">
                {!(signInProvider === "google.com" && isPasswordProviderPresent()) && (
                  <input
                    className="sign-in--input"
                    ref={firstPasswordRef}
                    type="password"
                    placeholder={`${isPasswordProviderPresent() ? "Old password" : "Password"}`}
                    autoFocus
                  />
                )}
                <input
                  className="sign-in--input mb-10"
                  ref={secondPasswordRef}
                  type="password"
                  placeholder={`${isPasswordProviderPresent() ? "New password" : "Confirm password"}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
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