import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import Modal from "../modal";

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
        <p className="cursor-pointer font-bold text-xs text-[#cfcfcf]" onClick={() => setIsForgotPasswordModalOpen(true)}>
          Forgot password?
        </p>
      </div>
      {isForgotPasswordModalOpen && (
        <Modal
          type="send"
          id="forgot-password-modal-bg"
          heading="Reset Password"
          description={`An email will be sent to your email address, ${email}. Click on the link provided in the email and reset your password.`}
          setIsModalOpen={setIsForgotPasswordModalOpen}
          handleButtonClick={resetUserPassword}
        />
      )}
    </div >
  )
}