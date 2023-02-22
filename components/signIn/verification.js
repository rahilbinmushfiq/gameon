import { sendEmailVerification } from "firebase/auth";

export default function Verification({ user }) {
    return (
        <>
            <h3 className="text-xl font-bold">Verify Email</h3>
            <div className="flex flex-col">
                <p>You're almost there! A verification email has been sent to</p>
                <p className="font-bold">{user.email}</p>
            </div>
            <div>
                <p>Just click on the link provided in the email to complete your signup process.</p>
                <p>If you don't see it, you may check your spam folder.</p>
            </div>
            <div>
                <p>Still can't find our email?</p>
                <button
                    className="text-white bg-neutral-900 w-[8rem] h-8"
                    onClick={() => sendEmailVerification(user)}
                >
                    Resend Email
                </button>
            </div>
        </>
    )
}