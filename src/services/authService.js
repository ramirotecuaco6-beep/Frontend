// src/services/authService.js
import { auth } from "../components/utils/firebase.utils";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// ===== CAMBIAR SOLO ESTA PARTE =====
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// ===================================

// Registrar usuario
export const registrarUsuario = async (nombre, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Guardar en el backend
  await fetch(`${API_URL}/api/usuarios/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: user.uid,
      nombre,
      email,
    }),
  });

  return user;
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
