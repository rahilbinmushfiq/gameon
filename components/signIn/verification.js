import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import { BsFillSendFill, BsStopwatchFill } from "react-icons/bs"
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";

/*
 * Component for rendering the verification section of the Sign-in page. The component is rendered after a user submits their email and password registration form. The component displays a message indicating that a verification email has been sent to the user's email address and provides a button for the user to resend the verification email if they haven't received it yet. It also displays a countdown timer for resending the verification email.
 * 
 * @param {Object} user - The authenticated user.
 * @returns {JSX.Element} A JSX element that renders the verification section of the Sign-in page.
 */
export default function Verification({ user }) {
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const [countdown, setCountdown] = useState(60);

  // Start countdown timer when component mounts
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(countdown => countdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(countdownInterval);
    }

    // Clean up the countdown timer when the component unmounts
    return () => clearInterval(countdownInterval);
  }, [countdown]);

  // Function that handles resending verification email
  const handleLinkResend = () => {
    setIsPageLoading(true);

    try {
      sendEmailVerification(user);
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
    setCountdown(60); // Reset countdown timer
  };

  return (
    <>
      <div className="space-y-2">
        <h1>Verify Email</h1>
        <p>You're almost there! A verification email has been sent to <span className="font-bold">{user.email}</span>. Just click on the link provided in the email to complete your signup process.</p>
      </div>
      <div className="space-y-4">
        <p>If you don't see it, you may check your spam folder. Still can't find our email?</p>
        <div className="flex gap-6 items-center">
          <button
            className={`secondary-btn w-40 h-12 ${countdown > 0 ? "cursor-not-allowed hover:bg-[#a9a9a9]" : ""}`}
            type="button"
            disabled={countdown > 0} // Disable resend button if countdown is still ongoing
            onClick={handleLinkResend}
          >
            <p>Resend email</p>
            <BsFillSendFill size={15} color="#1f1f1f" />
          </button>
          {// If countdown is still ongoing, display countdown timer
            countdown > 0 && (
              <div className="flex justify-center items-center gap-2">
                <BsStopwatchFill size={15} color="#a9a9a9" />
                <p className="font-bold">
                  after {countdown >= 60 ? "01:00" : `00:${countdown < 10 ? `0${countdown}` : countdown}`}
                </p>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}
