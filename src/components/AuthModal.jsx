import { useState } from "react";
// Importa las funciones de autenticación
import { register, login } from "../components/utils/firebase.utils";
import { getAuth } from "firebase/auth"; // ✅ Import necesario para obtener el token

// ⬅ Cargar URL desde .env
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

console.log("🌐 API conectada a:", BASE_URL);

// Componente de carga
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function AuthModal({ onClose }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // ✅ Nuevo estado para éxito
  const [isLoading, setIsLoading] = useState(false);

  // Reset estados cuando cambia la vista
  const toggleView = () => {
    setIsLoginView((s) => !s);
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
  };

  // 🚀 Nueva función para sincronizar usuario con backend
  const syncWithBackend = async (user) => {
    try {
      // 🔥 Obtenemos el token Firebase
      const token = await user.getIdToken();
      console.log("Token de Firebase (syncWithBackend):", token);

      // ✅ Guardar token en localStorage para que otros componentes lo usen si hace falta
      try {
        localStorage.setItem("token", token);
      } catch (lsErr) {
        console.warn("No se pudo guardar token en localStorage:", lsErr);
      }

      const response = await fetch(`${BASE_URL}/user/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviamos token al backend
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      // Manejo seguro si backend devuelve non-JJSON
      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      console.log("Respuesta del backend (sync):", data ?? `HTTP ${response.status}`);
      return { ok: true, data };
    } catch (error) {
      console.error("Error sincronizando con backend:", error);
      return { ok: false, error };
    }
  };

  // Función que maneja tanto login como registro
  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Por favor, introduce tu correo y contraseña.");
      return;
    }
    if (!isLoginView && password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const auth = getAuth();
      let userCredential;

      if (isLoginView) {
        console.log("Intentando Iniciar Sesión...");
        userCredential = await login(email, password);
        console.log("Inicio de sesión exitoso");
        setSuccess("¡Inicio de sesión exitoso!");
      } else {
        console.log("Intentando Registrar Usuario...");
        userCredential = await register(email, password);
        console.log("Registro exitoso - Usuario creado en Firebase");
        setSuccess("¡Registro exitoso! Sincronizando...");
      }

      // ✅ Llamada al backend para sincronizar usuario
      const syncResult = await syncWithBackend(userCredential.user);

      if (!syncResult.ok) {
        console.warn("Advertencia: fallo sincronizando con backend:", syncResult.error);
        if (!isLoginView) {
          setSuccess("Cuenta creada, pero hubo un problema de sincronización. Puedes iniciar sesión.");
        }
      } else {
        // ✅ FEEDBACK VISUAL MEJORADO
        if (!isLoginView) {
          console.log("✅ Registro completado exitosamente");
          setSuccess("¡Registro completado! Redirigiendo...");
        } else {
          setSuccess("¡Sesión iniciada! Redirigiendo...");
        }
        
        // Pequeño delay para que el usuario vea el mensaje de éxito
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // ✅ Cierra el modal después de autenticación exitosa
      onClose();

    } catch (err) {
      const errorCode = err.code;
      let userFriendlyMessage =
        "Error de conexión o credenciales inválidas. Intenta de nuevo.";

      if (errorCode === "auth/email-already-in-use") {
        userFriendlyMessage = "Este correo ya está registrado.";
      } else if (
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/invalid-credential"
      ) {
        userFriendlyMessage =
          "Credenciales inválidas. Verifica tu correo o contraseña.";
      } else if (errorCode === "auth/network-request-failed") {
        userFriendlyMessage = "Problema de red. Revisa tu conexión a Internet.";
      } else if (errorCode === "auth/too-many-requests") {
        userFriendlyMessage = "Demasiados intentos. Intenta más tarde.";
      }

      setError(userFriendlyMessage);
      console.error("Error de autenticación:", errorCode, err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          {isLoginView ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {/* ✅ Mensajes de éxito */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium text-center">
                {success}
              </p>
            </div>
          )}

          {/* ❌ Mensajes de error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium text-center">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 mt-5 flex items-center justify-center disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Spinner />
                {isLoginView ? "Iniciando..." : "Registrando..."}
              </>
            ) : isLoginView ? (
              "Entrar"
            ) : (
              "Registrarme"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          {isLoginView ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button
            onClick={toggleView}
            disabled={isLoading}
            className="text-green-600 font-semibold ml-2 hover:text-green-700 transition-colors disabled:text-gray-400"
            type="button"
          >
            {isLoginView ? "Regístrate aquí" : "Inicia Sesión"}
          </button>
        </p>

        <div className="mt-6 border-t pt-4">
          <button
            className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <span className="text-xl mr-2">G</span>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}