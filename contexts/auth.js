import nookies from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import { getIdToken, onIdTokenChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext({
  user: null,
  isUserLoading: false
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
        setIsUserLoading(false);
      } else {
        const token = await getIdToken(user);
        setUser(user);
        nookies.set(undefined, "token", token, { path: "/" });
        setIsUserLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const tokenInterval = setInterval(async () => {
      if (auth.currentUser) await getIdToken(auth.currentUser, true);
    }, 10 * 60 * 1000);

    return () => clearInterval(tokenInterval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
