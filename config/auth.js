import nookies from "nookies";
import { auth } from "./firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { getIdToken, onIdTokenChanged } from "firebase/auth";

const AuthContext = createContext({
    user: null
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        return onIdTokenChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
                nookies.set(undefined, "token", "", { path: "/" });
            } else {
                const token = await getIdToken(user);
                setUser(user);
                nookies.set(undefined, "token", token, { path: "/" });
            }
        })
    }, []);

    useEffect(() => {
        const tokenInterval = setInterval(async () => {
            if (auth.currentUser) await getIdToken(auth.currentUser, true);
        }, 10 * 60 * 1000);

        return () => clearInterval(tokenInterval);
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};