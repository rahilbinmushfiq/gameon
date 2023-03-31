import { EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { db, googleProvider } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import { FaKey, FaChevronRight } from "react-icons/fa";

export default function UpdatePassword({ user, signInProvider }) {
  const { setIsPageLoading } = useLoading();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const firstPasswordRef = useRef("");
  const secondPasswordRef = useRef("");

  const isPasswordProviderPresent = () => {
    return user?.providerData.some(provider => provider.providerId.includes("password"));
  }

  const updateUserPassword = async (event) => {
    event.preventDefault();

    setIsPageLoading(true);

    passwordUpdate: try {
      if (isPasswordProviderPresent()) {
        let oldPassword = firstPasswordRef?.current?.value;
        let newPassword = secondPasswordRef?.current?.value;

        if (signInProvider === "password") {
          if (!oldPassword || !newPassword) {
            toast.error("Please fill up the form first.");
            break passwordUpdate;
          } else if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            break passwordUpdate;
          }

          let credential = EmailAuthProvider.credential(user.email, oldPassword);

          await reauthenticateWithCredential(user, credential);

          if (oldPassword === newPassword) {
            toast.error("Your old and new passwords are same.");
            break passwordUpdate;
          }
        } else {
          if (!newPassword) {
            toast.error("Please fill up the form first.");
            break passwordUpdate;
          } else if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            break passwordUpdate;
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
          break passwordUpdate;
        } else if (password.length < 6) {
          toast.error("Password must be at least 6 characters long.");
          break passwordUpdate;
        } else if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          break passwordUpdate;
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

    setIsPageLoading(false);
  }

  if (user) return (
    <section>
      <button
        className="info-container info-container--hover"
        onClick={() => setIsPasswordModalOpen(true)}
      >
        <div>
          <FaKey size={18} />
          <p>{isPasswordProviderPresent() ? "Change" : "Add"} Password</p>
        </div>
        <FaChevronRight size={14} color="#a9a9a9" />
      </button>
      {isPasswordModalOpen && (
        <div
          className="modal-bg"
          id="password-modal-bg"
          onClick={(event) => event.target.id === "password-modal-bg" && setIsPasswordModalOpen(false)}
        >
          <div className="mx-6 p-8 space-y-8 rounded-md bg-[#1f1f1f]">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">
                {isPasswordProviderPresent() ? "Update" : "Add"} Password
              </h3>
              {signInProvider === "google.com" ? (
                <p>After you press the "{isPasswordProviderPresent() ? "Update" : "Add"}" button, a pop-up will appear asking you to sign in with your email.</p>
              ) : (
                <p>Make sure that your new password is at least 6 characters long.</p>
              )}
            </div>
            <form className="space-y-8" onSubmit={updateUserPassword}>
              <div className="space-y-4 [&>input]:typing-input">
                {!(signInProvider === "google.com" && isPasswordProviderPresent()) && (
                  <input
                    ref={firstPasswordRef}
                    type="password"
                    placeholder={isPasswordProviderPresent() ? "Old password" : "Password"}
                    autoFocus
                  />
                )}
                <input
                  ref={secondPasswordRef}
                  type="password"
                  placeholder={isPasswordProviderPresent() ? "New password" : "Confirm password"}
                  autoFocus={signInProvider === "google.com"}
                />
              </div>
              <div className="modal-btn-container">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="primary-btn">
                  {isPasswordProviderPresent() ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}