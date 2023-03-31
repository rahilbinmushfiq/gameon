import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { BsFillSendFill, BsChevronLeft } from "react-icons/bs";
import { auth } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";

export default function ForgotPassword({ email }) {
  const { setIsPageLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetUserPassword = async () => {
    setIsPageLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent.");

      setIsModalOpen(false);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  }

  return (
    <div>
      <div className="flex justify-end">
        <p className="cursor-pointer font-bold text-xs text-[#cfcfcf]" onClick={() => setIsModalOpen(true)}>
          Forgot password?
        </p>
      </div>
      {isModalOpen && (
        <div
          className="modal-bg"
          id="forgot-password-modal"
          onClick={(event) => event.target.id === "forgot-password-modal" && setIsModalOpen(false)}
        >
          <div className="mx-6 p-8 space-y-10 rounded-md bg-[#1f1f1f]">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <p>An email will be sent to your email address, <span className="font-bold">{email}</span>. Click on the link provided in the email and reset your password.</p>
            </div>
            <div className="modal-btn-container">
              <button
                className="secondary-btn"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                <BsChevronLeft size={12} color="#1f1f1f" />
                <p>Cancel</p>
              </button>
              <button
                className="primary-btn"
                type="button"
                onClick={resetUserPassword}
              >
                <p>Send Link</p>
                <BsFillSendFill size={12} color="#f1f1f1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}