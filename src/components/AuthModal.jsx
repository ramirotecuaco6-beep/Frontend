import { useState } from "react";
import { register, login, signInWithGoogle } from "../components/utils/firebase.utils";

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

// ✅ URL CORREGIDA para apuntar a Render
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "https://ecolibres-backend.onrender.com/api";

export default function AuthModal({ onClose }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleView = () => {
    setIsLoginView((s) => !s);
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
  };

  const syncWithBackend = async (user) => {
    try {
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      // ✅ URL CORREGIDA - Ya no apunta a localhost
      const response = await fetch(`${BASE_URL}/user/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      return { ok: true, data };
    } catch (error) {
      console.error("Error sincronizando:", error);
      return { ok: false, error };
    }
  };

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
      let userCredential;

      if (isLoginView) {
        userCredential = await login(email, password);
        setSuccess("¡Inicio de sesión exitoso!");
      } else {
        userCredential = await register(email, password);
        setSuccess("¡Registro exitoso!");
      }

      await syncWithBackend(userCredential.user);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      onClose();
    } catch (err) {
      const errorCode = err.code;
      let msg = "Error de conexión o credenciales inválidas.";

      if (errorCode === "auth/email-already-in-use") msg = "Este correo ya está registrado.";
      if (errorCode === "auth/user-not-found") msg = "Usuario no encontrado.";
      if (errorCode === "auth/wrong-password") msg = "Contraseña incorrecta.";
      if (errorCode === "auth/network-request-failed") msg = "Revisa tu conexión.";
      if (errorCode === "auth/too-many-requests") msg = "Demasiados intentos. Intenta más tarde.";

      if (err instanceof Error) msg = err.message;
      
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
        const userCredential = await signInWithGoogle();
        await syncWithBackend(userCredential.user);

        setSuccess("¡Inicio de sesión con Google exitoso!");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        onClose();
    } catch (err) {
        console.error("Error en autenticación con Google:", err);
        let msg = "Error al iniciar sesión con Google. Inténtalo de nuevo.";
        
        if (err.message.includes("cancelado")) msg = "Inicio de sesión cancelado.";
        
        setError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          {isLoginView ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500"
              placeholder="tu@correo.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500"
              placeholder="Mínimo 6 caracteres"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-800"
            >
              {showPassword ? "☀️" : "⛅"}
            </button>
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center transition duration-150"
          >
            {isLoading ? <Spinner /> : isLoginView ? "Entrar" : "Registrarme"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          {isLoginView ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button onClick={toggleView} className="text-green-600 ml-2 font-semibold hover:text-green-700">
            {isLoginView ? "Regístrate aquí" : "Inicia Sesión"}
          </button>
        </p>

        <div className="mt-6 border-t pt-4">
          <button 
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 flex items-center justify-center transition duration-150"
          >
            {isLoading ? <Spinner /> : (
                <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.61 20.083c0-1.372-.117-2.73-.342-4.04H24v7.69h10.94c-.463 2.222-1.895 4.145-3.89 5.485v5.02h6.47c3.795-3.5 5.96-8.625 5.96-14.73z"></path>
                        <path fill="#FF3D00" d="M24 44c5.166 0 9.86-1.977 13.4-5.192l-6.47-5.02c-1.81 1.05-4.102 1.674-6.93 1.674-5.23 0-9.69-3.54-11.275-8.315h-6.79v5.27C7.657 37.03 15.012 44 24 44z"></path>
                        <path fill="#4CAF50" d="M12.72 27.288c-.288-.847-.44-1.74-.44-2.688s.152-1.84.44-2.688v-5.27h-6.79C4.69 16.68 4 20.254 4 24s.69 7.32 1.93 10.248l6.79-5.27z"></path>
                        <path fill="#1976D2" d="M24 10.3c2.723 0 5.25.92 7.22 2.688l5.72-5.72C33.86 3.42 29.234 1 24 1c-8.988 0-16.343 6.97-18.07 16.058l6.79 5.27c1.585-4.775 6.045-8.315 11.275-8.315z"></path>
                    </svg>
                    Continuar con Google
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}