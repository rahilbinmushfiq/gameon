import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../config/firebase";

export default function ForgotPassword({ email }) {
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const resetUserPassword = async () => {
    try {
      const something = await sendPasswordResetEmail(auth, email);

      console.log(something);

      setIsForgotPasswordModalOpen(false);

      alert("Reset link sent!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <p
        className="underline cursor-pointer"
        onClick={() => setIsForgotPasswordModalOpen(true)}
      >
        Forgot password?
      </p>
      {isForgotPasswordModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black bg-opacity-25 backdrop-blur flex justify-center items-center"
          id="forgot-password-modal-bg"
          onClick={(event) => event.target.id === "forgot-password-modal-bg" && setIsForgotPasswordModalOpen(false)}
        >
          <div className="w-[40rem] h-[20rem] flex flex-col justify-center items-center bg-white shadow-2xl">
            <h2 className="mb-6 text-2xl">RESET YOUR PASSWORD</h2>
            <div className="flex flex-col gap-2">
              <div className="w-[34rem]">
                <p>An email will be sent to your email address, <span className="font-semibold">{email}</span>. Click on the link provided in the email and reset your password.<br /><br /></p>
                <p>If you don't see it in your inbox, you may want to check your spam folder.</p>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  className="text-white bg-black w-[5rem] h-8"
                  type="button"
                  onClick={() => setIsForgotPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="text-white bg-green-700 w-[8rem] h-8"
                  onClick={resetUserPassword}
                >
                  Send reset link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}