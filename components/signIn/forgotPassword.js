import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import Modal from "../modal";

/*
 * The Forgot Password component displays a button that opens a modal allowing users to reset their password. The component is rendered on the email and password sign-in form.
 * 
 * @param {string} email - The email state which holds the email address entered by the user.
 * @returns {JSX.Element} A JSX Element that displays the forgot password button on the sign-in form.
 */
export default function ForgotPassword({ email }) {
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false); // State hook for tracking whether to open or close the 'forgot password' modal

  // Function that sends a password reset email
  const resetUserPassword = async () => {
    setIsPageLoading(true);

    try {
      // Attempt to send a password reset email to the user's email address
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent.");
      setIsForgotPasswordModalOpen(false); // Close 'forgot password' modal
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  return (
    <div>
      {/* Button to open 'forgot password' modal */}
      <div className="flex justify-end">
        <p className="cursor-pointer font-bold text-sm text-[#cfcfcf]" onClick={() => setIsForgotPasswordModalOpen(true)}>
          Forgot password?
        </p>
      </div>
      {/* If modal state is true, render the Modal component for resetting password */
        isForgotPasswordModalOpen && (
          <Modal
            type="send"
            id="forgot-password-modal-bg"
            heading="Reset Password"
            description={`An email will be sent to your email address, ${email}. Click on the link provided in the email and reset your password.`}
            setIsModalOpen={setIsForgotPasswordModalOpen}
            handleButtonClick={resetUserPassword}
          />
        )
      }
    </div >
  );
}
