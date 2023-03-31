import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import { BsFillSendFill, BsStopwatchFill } from "react-icons/bs"
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";

export default function Verification({ user }) {
  const { setIsPageLoading } = useLoading();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(countdown => countdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(countdownInterval);
    }

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  const handleLinkResend = () => {
    setIsPageLoading(true);

    try {
      sendEmailVerification(user);
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
    setCountdown(60);
  }

  return (
    <>
      <div className="space-y-2">
        <h1>Verify Email</h1>
        <p className="leading-6">
          You're almost there! A verification email has been sent to <span className="font-bold">{user.email}</span>. Just click on the link provided in the email to complete your signup process.
        </p>
      </div>
      <div className="space-y-4">
        <p>If you don't see it, you may check your spam folder. Still can't find our email?</p>
        <div className="flex gap-6 items-center">
          <button
            className={`secondary-btn w-40 h-12 ${countdown > 0 ? "cursor-not-allowed hover:bg-[#a9a9a9]" : ""}`}
            type="button"
            disabled={countdown > 0}
            onClick={handleLinkResend}
          >
            <p>Resend email</p>
            <BsFillSendFill size={15} color="#1f1f1f" />
          </button>
          {countdown > 0 && (
            <div className="flex gap-2 justify-center items-center">
              <BsStopwatchFill size={15} color="#a9a9a9" />
              <p className="font-bold">
                after {countdown >= 60 ? "01:00" : `00:${countdown < 10 ? `0${countdown}` : countdown}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}