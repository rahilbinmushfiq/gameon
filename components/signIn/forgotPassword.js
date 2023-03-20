import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";

export default function ForgotPassword({ email }) {
  const { setIsPageLoading } = useLoading();
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const resetUserPassword = async () => {
    setIsPageLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent.");

      setIsForgotPasswordModalOpen(false);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  }

  return (
    <div>
      <div className="flex justify-end">
        <p
          className="text-xs font-bold text-[#d9d9d9] underline cursor-pointer"
          onClick={() => setIsForgotPasswordModalOpen(true)}
        >
          Forgot password?
        </p>
      </div>
      {isForgotPasswordModalOpen && (
        <div
          className="fixed inset-0 z-[1] w-screen h-screen bg-[#3f3f3f] bg-opacity-50 backdrop-blur-md flex justify-center items-center"
          id="forgot-password-modal-bg"
          onClick={(event) => event.target.id === "forgot-password-modal-bg" && setIsForgotPasswordModalOpen(false)}
        >
          <div className="mx-6 p-8 rounded-md space-y-16 bg-[#1f1f1f]">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">RESET YOUR PASSWORD</h2>
              <div className="space-y-4 text-[#a9a9a9]">
                <p>An email will be sent to your email address, <span className="font-bold">{email}</span>. Click on the link provided in the email and reset your password.</p>
                <p>If you don't see it in your inbox, you may want to check your spam folder.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="w-full h-12 rounded-sm font-semibold text-[#1f1f1f] bg-[#f1f1f1]"
                type="button"
                onClick={() => setIsForgotPasswordModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]"
                type="button"
                onClick={resetUserPassword}
              >
                Send link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}