import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { FaCamera, FaImage } from "react-icons/fa";

// ⬅ Cargar URL desde .env
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

console.log("🌐 Galería conectada a:", BASE_URL);

export default function Galeria() {
  const { user, token, loading } = useAuth();
  const { darkMode } = useDarkMode();

  const [allPhotos, setAllPhotos] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // 🕒 Limpia mensajes después de 4s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 🌍 Cargar fotos públicas
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/all-photos`);
        if (!res.ok) throw new Error("Error cargando galería");

        const data = await res.json();
        if (data.success && Array.isArray(data.photos)) setAllPhotos(data.photos);
        else setAllPhotos([]);
      } catch (err) {
        console.error(err);
        setMessage("❌ Error cargando galería");
      } finally {
        setLoadingGallery(false);
      }
    };

    if (!loading) loadPhotos();
  }, [loading]);

  // 📤 Subir foto - CORREGIDO: Cambiado de "image" a "photo"
  const handlePhotoUpload = async (e) => {
    if (!user || !token) return setMessage("❌ Debes iniciar sesión");

    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setMessage("❌ Solo imágenes");
    if (file.size > 10 * 1024 * 1024)
      return setMessage("❌ Máximo 10 MB");

    setUploading(true);
    try {
      const formData = new FormData();
      // 🔥 CORRECCIÓN: Cambiado de "image" a "photo"
      formData.append("photo", file);
      formData.append("description", "Compartiendo mi experiencia en Ecolibres");
      formData.append("location", "Libres, Puebla");
      formData.append("isPublic", "true");

      console.log('📤 Enviando foto con campo:', "photo");

      const res = await fetch(`${BASE_URL}/user/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('❌ Error del servidor:', data);
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      if (data.success) {
        setAllPhotos((prev) => [data.photo, ...prev]);
        setMessage("✅ Foto subida correctamente");
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (err) {
      console.error("❌ Error completo al subir:", err);
      setMessage("❌ No se pudo subir la imagen: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <div
          className={`rounded-2xl shadow-lg p-8 mb-6 text-center transition-all ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-4 ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            Galería Comunitaria
          </h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Descubre las experiencias de la comunidad en los lugares de Libres
          </p>
        </div>

        {/* Controles */}
        <div
          className={`rounded-2xl shadow-lg p-6 mb-6 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Fotos de la Comunidad
              </h2>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {allPhotos.length} fotos compartidas
              </p>
            </div>

            {user ? (
              <label
                className={`px-6 py-3 rounded-lg cursor-pointer flex items-center gap-2 font-semibold transition ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-500 text-white shadow-lg"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                }`}
              >
                <FaCamera />
                {uploading ? "Subiendo..." : "Compartir Foto"}
                <input
                  type="file"
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            ) : (
              <div className="text-center">
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Inicia sesión para compartir fotos
                </p>
                <a
                  href="#"
                  onClick={() =>
                    setMessage("🔒 Inicia sesión desde el menú superior")
                  }
                  className={`font-semibold ${
                    darkMode
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                  }`}
                >
                  Iniciar Sesión
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Carga */}
        {uploading && (
          <div
            className={`rounded-lg p-4 mb-6 text-center ${
              darkMode
                ? "bg-blue-900/30 border border-blue-700"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2 ${
                darkMode ? "border-blue-400" : "border-blue-600"
              }`}
            ></div>
            <p className={`${darkMode ? "text-blue-300" : "text-blue-700"}`}>
              Subiendo imagen...
            </p>
          </div>
        )}

        {/* Galería */}
        <div
          className={`rounded-2xl shadow-lg p-6 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          {loadingGallery ? (
            <div className="flex justify-center items-center h-32">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                  darkMode ? "border-green-400" : "border-green-600"
                }`}
              ></div>
              <p
                className={`ml-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Cargando galería...
              </p>
            </div>
          ) : allPhotos.length === 0 ? (
            <div className="text-center py-16">
              <FaImage
                className={`text-8xl mx-auto mb-6 ${
                  darkMode ? "text-gray-600" : "text-gray-300"
                }`}
              />
              <h3
                className={`text-2xl font-bold ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No hay fotos aún
              </h3>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Sé el primero en compartir una experiencia
              </p>
              {user && (
                <label
                  className={`px-6 py-2 rounded-lg inline-flex items-center gap-2 cursor-pointer ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <FaCamera />
                  Compartir Primera Foto
                  <input
                    type="file"
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allPhotos.map((photo, index) => {
                const imageUrl =
                  photo.url ||
                  photo.secure_url ||
                  photo.imageUrl ||
                  "";

                return (
                  <div
                    key={photo._id || index}
                    className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600"
                        : "bg-gray-50 hover:bg-white"
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={photo.description || "Foto"}
                      className="w-full h-64 object-cover"
                      onError={(e) =>
                        (e.target.src = `https://picsum.photos/600/400?random=${index}`)
                      }
                    />

                    <div className="p-4">
                      <p
                        className={`font-medium mb-2 line-clamp-2 ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {photo.description || "Sin descripción"}
                      </p>

                      <div
                        className={`flex justify-between items-center text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <span>📍 {photo.location || "Libres, Puebla"}</span>
                        <span>
                          {photo.uploadedAt
                            ? new Date(photo.uploadedAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      {user && photo.userId === user.uid && (
                        <span
                          className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                            darkMode
                              ? "bg-green-800 text-green-300"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          Tu foto
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mensaje flotante */}
        {message && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              message.includes("❌") || message.includes("⚠️")
                ? "bg-red-600"
                : "bg-green-600"
            } text-white`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}