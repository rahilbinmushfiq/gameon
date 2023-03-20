import { sendEmailVerification } from "firebase/auth";
import { BsFillSendFill } from "react-icons/bs"
import { toast } from "react-toastify";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";

export default function Verification({ user }) {
  const { setIsPageLoading } = useLoading();

  const handleLinkResend = () => {
    setIsPageLoading(true);

    try {
      sendEmailVerification(user);
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  }
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-xl font-bold">Verify Email</h1>
        <p className="text-[#a9a9a9] leading-6">
          You're almost there! A verification email has been sent to <span className="font-bold">{user.email}</span>. Just click on the link provided in the email to complete your signup process.
        </p>
      </div>
      <div className="space-y-4">
        <h4 className="text-[#a9a9a9]">If you don't see it, you may check your spam folder. Still can't find our email?</h4>
        <button
          className="flex gap-2 justify-center items-center w-40 h-12 rounded-sm text-[#1f1f1f] bg-[#f1f1f1]"
          type="button"
          onClick={handleLinkResend}
        >
          <p className="font-semibold">Resend email</p>
          <BsFillSendFill size={15} color="#1f1f1f" />
        </button>
      </div>
    </>
  )
}