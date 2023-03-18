import { EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { db, googleProvider } from "../../config/firebase";
import createErrorMessage from "../../utils/createErrorMessage";

export default function UpdatePassword({ user, signInProvider }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const firstPasswordRef = useRef("");
  const secondPasswordRef = useRef("");

  const isPasswordProviderPresent = () => {
    return user?.providerData.some(provider => provider.providerId.includes("password"));
  }

  const updateUserPassword = async (event) => {
    event.preventDefault();

    try {
      if (isPasswordProviderPresent()) {
        let oldPassword = firstPasswordRef?.current?.value;
        let newPassword = secondPasswordRef?.current?.value;

        if (signInProvider === "password") {
          if (!oldPassword || !newPassword) {
            toast.error("Please fill up the form first.");
            return;
          } else if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
          }

          let credential = EmailAuthProvider.credential(user.email, oldPassword);

          await reauthenticateWithCredential(user, credential);

          if (oldPassword === newPassword) {
            toast.error("Your old and new passwords are same.");
            return;
          }
        } else {
          if (!newPassword) {
            toast.error("Please fill up the form first.");
            return;
          } else if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
          }

          await reauthenticateWithPopup(user, googleProvider);
        }

        await updatePassword(user, newPassword);

        setIsPasswordModalOpen(false);
        toast.success("Password updated!");
      } else {
        let password = firstPasswordRef?.current?.value;
        let confirmPassword = secondPasswordRef?.current?.value;

        if (!password || !confirmPassword) {
          toast.error("Please fill up the form first.");
          return;
        } else if (password.length < 6) {
          toast.error("Password must be at least 6 characters long.");
          return;
        } else if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }
        await reauthenticateWithPopup(user, googleProvider);

        let credential = EmailAuthProvider.credential(user.email, password);

        await linkWithCredential(user, credential);
        await updateDoc(doc(db, "users", user.uid), { linked: true });

        setIsPasswordModalOpen(false);
        toast.success("Password added. Now, you can sign in with email and password.");
      }
    } catch (error) {
      toast.error(createErrorMessage(error));
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