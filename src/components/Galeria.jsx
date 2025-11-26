import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { FaCamera, FaImage, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

export default function Galeria() {
  const { user, token, loading } = useAuth();
  const { darkMode } = useDarkMode();

  const [allPhotos, setAllPhotos] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/all-photos`);
        if (!res.ok) throw new Error("Error cargando galería");

        const data = await res.json();
        if (data.success && Array.isArray(data.photos)) {
          setAllPhotos(data.photos);
        } else {
          setAllPhotos([]);
        }
      } catch (err) {
        console.error("Error loading photos:", err);
        setMessage("Error cargando galería");
      } finally {
        setLoadingGallery(false);
      }
    };

    if (!loading) loadPhotos();
  }, [loading]);

  const handlePhotoUpload = async (e) => {
    if (!user || !token) return setMessage("Debes iniciar sesión");

    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setMessage("Solo imágenes");
    if (file.size > 10 * 1024 * 1024)
      return setMessage("Máximo 10 MB");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("description", "Compartiendo mi experiencia en Ecolibres");
      formData.append("location", "Libres, Puebla");
      formData.append("isPublic", "true");

      const res = await fetch(`${BASE_URL}/user/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      if (data.success) {
        setAllPhotos((prev) => [data.photo, ...prev]);
        setMessage("Foto subida correctamente");
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (err) {
      setMessage("No se pudo subir la imagen: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // 🆕 FUNCIÓN CORREGIDA - Abrir modal
  const openModal = (index) => {
    console.log("🖱️ Abriendo modal con índice:", index);
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  // 🆕 FUNCIÓN CORREGIDA - Cerrar modal
  const closeModal = () => {
    console.log("❌ Cerrando modal");
    setIsModalOpen(false);
  };

  // 🆕 FUNCIÓN CORREGIDA - Navegar fotos
  const navigatePhotos = (direction) => {
    let newIndex = currentPhotoIndex + direction;
    const totalPhotos = allPhotos.length;

    if (newIndex >= totalPhotos) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = totalPhotos - 1;
    }
    console.log("🔄 Navegando a foto:", newIndex);
    setCurrentPhotoIndex(newIndex);
  };

  // 🆕 FUNCIÓN CORREGIDA - Obtener URL de foto actual
  const getCurrentPhotoUrl = () => {
    if (allPhotos.length === 0) return "";
    const photo = allPhotos[currentPhotoIndex];
    const url = photo.url || photo.secure_url || photo.imageUrl || "";
    console.log("📷 URL de foto actual:", url);
    return url;
  };

  // 🆕 EFECTO PARA CERRAR CON TECLA ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Evitar scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
                    setMessage("Inicia sesión desde el menú superior")
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

        {/* Mensaje de carga de subida */}
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

        {/* Galería de Fotos */}
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
                    className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600 hover:border-gray-500"
                        : "bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => openModal(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={photo.description || "Foto de la galería"}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/600/400?random=${index}`;
                      }}
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
                            : "Fecha no disponible"}
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
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
              message.includes("Error") || message.includes("Debes") || message.includes("No se pudo")
                ? "bg-red-600"
                : "bg-green-600"
            } text-white`}
          >
            {message}
          </div>
        )}
      </div>

      {/* 🖼️ MODAL DE FOTO EN GRANDE - CORREGIDO */}
      {isModalOpen && allPhotos.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeModal}
        >
          {/* Contenedor principal - evita cerrar al hacer click en la imagen */}
          <div 
            className="relative w-full h-full flex items-center justify-center max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button 
              className="absolute top-4 right-4 z-60 text-white text-3xl p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
              onClick={closeModal}
            >
              <FaTimes />
            </button>

            {/* Botón Anterior */}
            <button
              className="absolute left-4 z-60 p-4 text-white text-2xl bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300"
              onClick={() => navigatePhotos(-1)}
            >
              <FaChevronLeft />
            </button>

            {/* Imagen Principal */}
            <div className="flex items-center justify-center w-full h-full p-8">
              <img
                src={getCurrentPhotoUrl()}
                alt={allPhotos[currentPhotoIndex]?.description || "Foto en grande"}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Botón Siguiente */}
            <button
              className="absolute right-4 z-60 p-4 text-white text-2xl bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300"
              onClick={() => navigatePhotos(1)}
            >
              <FaChevronRight />
            </button>

            {/* Información de la foto */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white p-4 rounded-lg text-center max-w-2xl w-full mx-4">
              <p className="font-semibold text-lg">
                {allPhotos[currentPhotoIndex]?.description || "Sin descripción"}
              </p>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
                <span>📍 {allPhotos[currentPhotoIndex]?.location || "Libres, Puebla"}</span>
                <span>
                  {currentPhotoIndex + 1} / {allPhotos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}   