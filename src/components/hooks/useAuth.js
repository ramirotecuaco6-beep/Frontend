import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Incluye signOut para el futuro
import { auth } from '../utils/firebase.utils'; // Asegúrate de que la ruta de importación sea correcta

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es la función de Firebase que escucha si la sesión cambia
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Función de limpieza
    return unsubscribe;
  }, []);

  // Función para cerrar la sesión
  const logout = () => signOut(auth);

  return { currentUser, loading, logout };
}