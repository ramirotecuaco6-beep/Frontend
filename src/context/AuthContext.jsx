import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth } from "../components/utils/firebase.utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const newToken = await getIdToken(firebaseUser, true);
        setUser(firebaseUser);
        setToken(newToken);
        localStorage.setItem("token", newToken); // ✅ Guarda token
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Escucha cambios en el token (por ejemplo, cuando expira)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        const refreshedToken = await getIdToken(auth.currentUser, true);
        setToken(refreshedToken);
        localStorage.setItem("token", refreshedToken);
      }
    }, 30 * 60 * 1000); // cada 30 minutos

    return () => clearInterval(interval);
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
