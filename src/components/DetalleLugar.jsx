import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { apiService } from "../services/api";
import { useDarkMode } from "../context/DarkModeContext";

const DetalleLugar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [lugar, setLugar] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔹 Fetch lugar o actividad
  useEffect(() => {
    const fetchLugar = async () => {
      try {
        setLoading(true);
        let data;

        // Primero intentamos obtener como lugar
        try {
          data = await apiService.getLugarPorId(id);
        } catch {
          // Si falla, intentamos obtener actividad
          const actData = await apiService.getActividadPorId(id);
          if (!actData || !actData.lugarId) throw new Error("Lugar de la actividad no encontrado");
          data = await apiService.getLugarPorId(actData.lugarId);
        }

        setLugar(data.lugar);
        setActividades(data.actividades || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al obtener el lugar");
        setLugar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLugar();
  }, [id]);

  // 🔹 Carrusel multimedia
  useEffect(() => {
    if (!lugar) return;
    // Utilizamos lugar.imagenes y lugar.videos para el cálculo, asumiendo que 
    // si se usan, el carrusel debería funcionar.
    const totalSlides = (lugar.imagenes?.length || 0) + (lugar.videos?.length || 0);
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [lugar]);

  if (loading) return (
    <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      <div className="max-w-5xl mx-auto text-center">
        <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${
          darkMode ? 'border-green-400' : 'border-green-600'
        }`}></div>
        <p className={`mt-4 transition-colors duration-300 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Cargando lugar...
        </p>
      </div>
    </section>
  );

  if (error) return (
    <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      <div className="max-w-5xl mx-auto text-center">
        <div className={`text-6xl mb-4 ${
          darkMode ? 'text-red-400' : 'text-red-500'
        }`}>
          ⚠️
        </div>
        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          Error al cargar el lugar
        </h2>
        <p className={`text-lg mb-6 transition-colors duration-300 ${
          darkMode ? 'text-red-400' : 'text-red-600'
        }`}>
          {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          ← Volver
        </button>
      </div>
    </section>
  );

  if (!lugar) return null;

  // Variable de ayuda para la condición del carrusel
  const tieneCarrusel = (lugar.imagenes?.length || 0) + (lugar.videos?.length || 0) > 0;

  return (
    <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          ← Volver
        </button>

        {/* Carrusel MODIFICADO */}
        <motion.div
          className={`relative w-full h-96 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
            darkMode ? 'border border-gray-700' : ''
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {tieneCarrusel ? ( // 1. ¿Tiene carrusel de múltiples elementos?
            <>
              {currentSlide < (lugar.imagenes?.length || 0) ? (
                <img
                  src={lugar.imagenes[currentSlide]}
                  alt={`Slide ${currentSlide}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={lugar.videos[currentSlide - (lugar.imagenes?.length || 0)]}
                  controls
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </>
          ) : lugar.imagen_url ? ( // 2. Si no tiene carrusel, ¿Tiene la imagen única de Mongoose?
            <img // <--- Se muestra la imagen única aquí
              src={lugar.imagen_url}
              alt={`Imagen de ${lugar.nombre}`}
              className="w-full h-full object-cover"
            />
          ) : ( // 3. No hay nada
            <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <span className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No hay imágenes ni videos disponibles
              </span>
            </div>
          )}
        </motion.div>

        {/* Info lugar */}
        <motion.div
          className={`p-6 rounded-2xl shadow-lg space-y-4 transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white'
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl font-extrabold transition-colors duration-300 ${
            darkMode ? 'text-green-400' : 'text-green-700'
          }`}>
            {lugar.nombre}
          </h1>
          <p className={`text-lg leading-relaxed transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {lugar.descripcion}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`px-3 py-1 rounded-full font-semibold shadow-sm transition-all duration-300 ${
              darkMode 
                ? 'bg-yellow-600 text-yellow-100' 
                : 'bg-yellow-400 text-white'
            }`}>
              🌿 {lugar.caracteristicas?.join(", ") || "Sin características"}
            </span>
            <span className={`px-3 py-1 rounded-full font-semibold shadow-sm transition-all duration-300 ${
              darkMode 
                ? 'bg-green-700 text-green-100' 
                : 'bg-green-600 text-white'
            }`}>
              💰 {lugar.precio || "Gratis"}
            </span>
            <span className={`px-3 py-1 rounded-full font-semibold shadow-sm transition-all duration-300 ${
              darkMode 
                ? 'bg-blue-600 text-blue-100' 
                : 'bg-blue-500 text-white'
            }`}>
              ⭐ {lugar.rating || "Sin calificación"}
            </span>
          </div>

          {/* Actividades asociadas */}
          {actividades.length > 0 && (
            <div className="mt-6">
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                darkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                🎯 Actividades Disponibles
              </h2>
              <div className="grid gap-3">
                {actividades.map(act => (
                  <div 
                    key={act._id} 
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {act.nombre || act.titulo}
                    </h3>
                    {act.descripcion && (
                      <p className={`text-sm mt-1 transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {act.descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mapa */}
          {lugar.coordenadas && (
            <div className={`mt-6 h-64 w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
              darkMode ? 'border border-gray-700' : ''
            }`}>
              <MapContainer
                center={[lugar.coordenadas.lat, lugar.coordenadas.lng]}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  url={darkMode 
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                  attribution={darkMode 
                    ? "&copy; CartoDB"
                    : "&copy; OpenStreetMap contributors"
                  }
                />
                <Marker position={[lugar.coordenadas.lat, lugar.coordenadas.lng]}>
                  <Popup className={`${darkMode ? 'dark-popup' : ''}`}>
                    <div className={`text-center ${darkMode ? 'text-gray-800' : ''}`}>
                      <strong>{lugar.nombre}</strong>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </motion.div>

        {/* Información adicional */}
        <motion.div
          className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-green-400' : 'text-green-700'
          }`}>
            ℹ️ Información Adicional
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                📍 Ubicación
              </h3>
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {lugar.ubicacion || "Ubicación no especificada"}
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                🕒 Horario
              </h3>
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {lugar.horario || "Horario no especificado"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DetalleLugar;