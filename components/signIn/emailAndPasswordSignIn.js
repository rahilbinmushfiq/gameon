import createErrorMessage from "../../utils/createErrorMessage";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function EmailAndPasswordSignIn({ email, setEmail, passwordRef, isUserNew, setIsUserNew, setIsUserLoaded }) {
    const handleSignIn = async (event) => {
        event.preventDefault();

        let password = passwordRef?.current?.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(createErrorMessage(error));
            return;
        }

        if (isUserNew) setIsUserNew(false);
        setIsUserLoaded(true);
    }

    return (
        <form className="flex flex-col w-fit gap-4" onSubmit={handleSignIn}>
            <input
                className="border border-neutral-900 w-[15rem] h-8"
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
                autoFocus
            />
            <div className="flex justify-between">
                <button
                    className="text-white bg-neutral-900 w-[5rem] h-8"
                    type="button"
                    onClick={() => setEmail("")}
                >
                    Back
                </button>
                <button
                    className="text-white bg-neutral-900 w-[5rem] h-8"
                    type="submit"
                    onClick={handleSignIn}
                >
                    Sign in
                </button>
            </div>
        </form>
    )
}