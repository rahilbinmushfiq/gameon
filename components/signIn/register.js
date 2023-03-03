import createErrorMessage from "../../utils/createErrorMessage";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Register({ email, setEmail, fullNameRef, passwordRef, confirmPasswordRef }) {
    const router = useRouter();

    const handleRegister = async (event) => {
        event.preventDefault();

        let password = passwordRef?.current?.value;
        let confirmPassword = confirmPasswordRef?.current?.value;
        let fullName = fullNameRef?.current?.value;

        if (password != confirmPassword) {
            console.log("passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            try {
                await updateProfile(userCredential?.user, {
                    displayName: fullName,
                    photoURL: "https://180dc.org/wp-content/uploads/2016/08/default-profile.png"
                });
            } catch (updateProfileError) {
                console.log(createErrorMessage(updateProfileError));
                return;
            }

            try {
                await setDoc(doc(db, "users", userCredential?.user?.uid), {
                    email: email,
                    fullName: fullName,
                    photoURL: "https://180dc.org/wp-content/uploads/2016/08/default-profile.png",
                    registrationMethod: "password",
                    linked: false
                });
            } catch (docError) {
                console.log(createErrorMessage(docError));
                return;
            }

            try {
                await sendEmailVerification(userCredential.user);
            } catch (sendVerificationError) {
                console.log(createErrorMessage(sendVerificationError));
                return;
            }
        } catch (signUpError) {
            console.log(createErrorMessage(signUpError));
            return;
        }
    }

    return (
        (<form className="flex flex-col w-fit gap-4" onSubmit={handleRegister}>
            <input
                className="border border-neutral-900 w-[15rem] h-8"
                ref={fullNameRef}
                type="text"
                placeholder="Enter your full name"
                autoFocus
            />
            <input
                className="border border-neutral-900 w-[15rem] h-8"
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
            />
            <input
                className="border border-neutral-900 w-[15rem] h-8"
                ref={confirmPasswordRef}
                type="password"
                placeholder="Confirm your password"
            />
            <div className="flex justify-between">
                <button
                    className="text-white bg-neutral-900 w-[4rem] h-8"
                    type="button"
                    onClick={() => setEmail("")}
                >
                    Back
                </button>
                <button
                    className="text-white bg-neutral-900 w-[9rem] h-8"
                    type="submit"
                    onClick={handleRegister}
                >
                    Create account
                </button>
            </div>
        </form>)
    )
}